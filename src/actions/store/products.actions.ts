"use server";

import { prisma } from "@/lib/prisma";
import { getPriceConfig } from "@/actions/config";
import { calcPriceArs, type PriceInfo } from "@/lib/price-utils";

export type StoreProduct = {
    id: string;
    sku: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    category: string;
    stock: number;
    priceUsd: number;
    priceArs: number;
    unitsPerBox: number | null;
    offerPriceUsd: number | null;
    offerPriceArs: number | null;
    offerUnit: "unit" | "box" | null;
};

const productSelect = {
    id: true, sku: true, name: true, description: true, imageUrl: true,
    category: true, stock: true, price: true,
    unitsPerBox: true, offerPriceUsd: true, offerUnit: true,
} as const;

function mapProduct(p: {
    id: string; sku: string; name: string; description: string | null;
    imageUrl: string | null; category: string; stock: number;
    price: { toNumber(): number } | number | string;
    unitsPerBox: number | null;
    offerPriceUsd: { toNumber(): number } | number | string | null;
    offerUnit: string | null;
}, priceInfo: PriceInfo): StoreProduct {
    const priceUsd = typeof p.price === "object" ? p.price.toNumber() : Number(p.price);
    const offerPriceUsd = p.offerPriceUsd !== null && p.offerPriceUsd !== undefined
        ? (typeof p.offerPriceUsd === "object" ? p.offerPriceUsd.toNumber() : Number(p.offerPriceUsd))
        : null;
    return {
        id: p.id, sku: p.sku, name: p.name, description: p.description,
        imageUrl: p.imageUrl, category: p.category, stock: p.stock,
        priceUsd,
        priceArs: Math.round(calcPriceArs(priceUsd, priceInfo)),
        unitsPerBox: p.unitsPerBox,
        offerPriceUsd,
        offerPriceArs: offerPriceUsd !== null ? Math.round(calcPriceArs(offerPriceUsd, priceInfo)) : null,
        offerUnit: (p.offerUnit as "unit" | "box" | null) ?? null,
    };
}

export async function getStoreProduct(id: string): Promise<StoreProduct | null> {
    const [product, config] = await Promise.all([
        prisma.product.findUnique({ where: { id, deletedAt: null }, select: productSelect }),
        getPriceConfig(),
    ]);
    if (!product || !config) return null;
    const priceInfo: PriceInfo = { dollarRate: config.dollarRate, shippingPct: config.shippingPct, profitPct: config.profitPct };
    return mapProduct(product, priceInfo);
}

export async function getStoreProducts(): Promise<{ products: StoreProduct[]; config: PriceInfo | null }> {
    const [products, config] = await Promise.all([
        prisma.product.findMany({
            where: { deletedAt: null },
            orderBy: { name: "asc" },
            select: productSelect,
        }),
        getPriceConfig(),
    ]);

    if (!config) return { products: [], config: null };

    const priceInfo: PriceInfo = { dollarRate: config.dollarRate, shippingPct: config.shippingPct, profitPct: config.profitPct };
    return { products: products.map((p) => mapProduct(p, priceInfo)), config: priceInfo };
}
