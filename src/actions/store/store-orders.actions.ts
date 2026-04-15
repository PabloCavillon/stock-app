"use server";

import { prisma } from "@/lib/prisma";
import { getPriceConfig } from "@/actions/config";
import { getStoreSession } from "@/lib/store-auth";
import { calcPriceArs } from "@/lib/price-utils";
import { customAlphabet } from "nanoid";
import { revalidatePath } from "next/cache";

const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890", 8);

export type CheckoutItem = {
    productId?: string;
    kitId?: string;
    quantity: number;
};

export type CheckoutResult = { code: string } | { error: string };

/** Recursively collect all leaf product requirements for a kit */
async function getKitLeafProducts(kitId: string, qty: number): Promise<Map<string, number>> {
    const items = await prisma.kitItem.findMany({ where: { kitId } });
    const result = new Map<string, number>();
    for (const item of items) {
        const total = item.quantity * qty;
        if (item.productId) {
            result.set(item.productId, (result.get(item.productId) ?? 0) + total);
        } else if (item.childKitId) {
            const child = await getKitLeafProducts(item.childKitId, total);
            for (const [pid, pqty] of child) {
                result.set(pid, (result.get(pid) ?? 0) + pqty);
            }
        }
    }
    return result;
}

export async function createStoreOrder(items: CheckoutItem[]): Promise<CheckoutResult> {
    const session = await getStoreSession();
    if (!session) return { error: "Debés iniciar sesión para hacer un pedido." };
    if (!items.length) return { error: "El carrito está vacío." };

    const config = await getPriceConfig();
    if (!config) return { error: "Sin configuración de precios. Contactá al administrador." };

    const productItems = items.filter((i) => i.productId);
    const kitItems = items.filter((i) => i.kitId);

    // --- Validate & price products ---
    const products = productItems.length
        ? await prisma.product.findMany({
            where: { id: { in: productItems.map((i) => i.productId!) }, deletedAt: null },
            select: { id: true, price: true, stock: true },
        })
        : [];
    const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

    for (const item of productItems) {
        const p = productMap[item.productId!];
        if (!p) return { error: "Producto no encontrado." };
        if (p.stock < item.quantity) return { error: `Stock insuficiente para uno de los productos.` };
    }

    // --- Validate & price kits ---
    const kits = kitItems.length
        ? await prisma.kit.findMany({
            where: { id: { in: kitItems.map((i) => i.kitId!) }, deletedAt: null, isActive: true },
            select: { id: true, price: true },
        })
        : [];
    const kitMap = Object.fromEntries(kits.map((k) => [k.id, k]));

    for (const item of kitItems) {
        if (!kitMap[item.kitId!]) return { error: "Kit no encontrado." };
        // Check component stock
        const needed = await getKitLeafProducts(item.kitId!, item.quantity);
        for (const [productId, qty] of needed) {
            const product = await prisma.product.findUnique({ where: { id: productId }, select: { stock: true } });
            if (!product || product.stock < qty) return { error: `Stock insuficiente para un componente del kit.` };
        }
    }

    // --- Totals ---
    let subtotalUsd = 0;
    let subtotalArs = 0;

    for (const item of productItems) {
        const priceUsd = Number(productMap[item.productId!].price);
        subtotalUsd += priceUsd * item.quantity;
        subtotalArs += calcPriceArs(priceUsd, config) * item.quantity;
    }
    for (const item of kitItems) {
        const priceUsd = Number(kitMap[item.kitId!].price);
        subtotalUsd += priceUsd * item.quantity;
        subtotalArs += calcPriceArs(priceUsd, config) * item.quantity;
    }

    // --- Discount ---
    const storeCustomer = await prisma.storeCustomer.findUnique({
        where: { id: session.id },
        include: { customer: { select: { isGuild: true } } },
    });
    const isGuild = storeCustomer?.customer?.isGuild ?? false;
    const guildDiscount = isGuild ? config.guildDiscountPct : 0;
    const volumeDiscount = subtotalArs >= config.volumeThresholdArs ? config.volumeDiscountPct : 0;
    const discountApplied = Math.max(guildDiscount, volumeDiscount);
    const discountType =
        discountApplied === 0 ? "NONE"
        : guildDiscount >= volumeDiscount ? "GUILD"
        : "VOLUME";

    const code = `STR-${nanoid()}`;

    await prisma.storeOrder.create({
        data: {
            code,
            storeCustomerId: session.id,
            dollarRateAtCreation: config.dollarRate,
            subtotalUsd,
            discountApplied,
            discountType,
            items: {
                create: [
                    ...productItems.map((item) => ({
                        productId: item.productId!,
                        quantity: item.quantity,
                        unitPriceUsd: Number(productMap[item.productId!].price),
                    })),
                    ...kitItems.map((item) => ({
                        kitId: item.kitId!,
                        quantity: item.quantity,
                        unitPriceUsd: Number(kitMap[item.kitId!].price),
                    })),
                ],
            },
        },
    });

    revalidatePath("/store/orders");
    return { code };
}

export type SerializedStoreOrder = {
    id: string;
    code: string;
    status: string;
    subtotalUsd: number;
    discountApplied: number;
    discountType: string | null;
    dollarRateAtCreation: number;
    totalArs: number | null;
    notes: string | null;
    createdAt: string;
    items: {
        id: string;
        productId: string | null;
        productName: string | null;
        productSku: string | null;
        kitId: string | null;
        kitName: string | null;
        kitSku: string | null;
        quantity: number;
        unitPriceUsd: number;
    }[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeOrder(o: any): SerializedStoreOrder {
    return {
        id: o.id,
        code: o.code,
        status: o.status,
        subtotalUsd: Number(o.subtotalUsd),
        discountApplied: Number(o.discountApplied),
        discountType: o.discountType,
        dollarRateAtCreation: Number(o.dollarRateAtCreation),
        totalArs: o.totalArs !== null ? Number(o.totalArs) : null,
        notes: o.notes,
        createdAt: o.createdAt.toISOString(),
        items: o.items.map((i: any) => ({
            id: i.id,
            productId: i.productId,
            productName: i.product?.name ?? null,
            productSku: i.product?.sku ?? null,
            kitId: i.kitId,
            kitName: i.kit?.name ?? null,
            kitSku: i.kit?.sku ?? null,
            quantity: i.quantity,
            unitPriceUsd: Number(i.unitPriceUsd),
        })),
    };
}

const orderInclude = {
    items: {
        include: {
            product: { select: { name: true, sku: true } },
            kit: { select: { name: true, sku: true } },
        },
    },
} as const;

export async function getMyStoreOrders(): Promise<SerializedStoreOrder[]> {
    const session = await getStoreSession();
    if (!session) return [];

    const orders = await prisma.storeOrder.findMany({
        where: { storeCustomerId: session.id, deletedAt: null },
        orderBy: { createdAt: "desc" },
        include: orderInclude,
    });

    return orders.map(serializeOrder);
}

export async function getMyStoreOrder(code: string): Promise<SerializedStoreOrder | null> {
    const session = await getStoreSession();
    if (!session) return null;

    const order = await prisma.storeOrder.findFirst({
        where: { code, storeCustomerId: session.id, deletedAt: null },
        include: orderInclude,
    });

    if (!order) return null;
    return serializeOrder(order);
}
