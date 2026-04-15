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
    priceArs: number; // calculado: USD × cotización × (1+envío%) × (1+ganancia%)
};

export async function getStoreProduct(id: string): Promise<StoreProduct | null> {
    const [product, config] = await Promise.all([
        prisma.product.findUnique({
            where: { id, deletedAt: null },
            select: { id: true, sku: true, name: true, description: true, imageUrl: true, category: true, stock: true, price: true },
        }),
        getPriceConfig(),
    ]);
    if (!product || !config) return null;
    const priceInfo: PriceInfo = { dollarRate: config.dollarRate, shippingPct: config.shippingPct, profitPct: config.profitPct };
    return {
        id: product.id, sku: product.sku, name: product.name, description: product.description,
        imageUrl: product.imageUrl, category: product.category, stock: product.stock,
        priceUsd: Number(product.price),
        priceArs: Math.round(calcPriceArs(Number(product.price), priceInfo)),
    };
}

export async function getStoreProducts(): Promise<{ products: StoreProduct[]; config: PriceInfo | null }> {
    const [products, config] = await Promise.all([
        prisma.product.findMany({
            where: { deletedAt: null, stock: { gt: 0 } },
            orderBy: { name: "asc" },
            select: { id: true, sku: true, name: true, description: true, imageUrl: true, category: true, stock: true, price: true },
        }),
        getPriceConfig(),
    ]);

    if (!config) {
        return { products: [], config: null };
    }

    const priceInfo: PriceInfo = {
        dollarRate: config.dollarRate,
        shippingPct: config.shippingPct,
        profitPct: config.profitPct,
    };

    return {
        products: products.map((p) => ({
            id: p.id,
            sku: p.sku,
            name: p.name,
            description: p.description,
            imageUrl: p.imageUrl,
            category: p.category,
            stock: p.stock,
            priceUsd: Number(p.price),
            priceArs: Math.round(calcPriceArs(Number(p.price), priceInfo)),
        })),
        config: priceInfo,
    };
}
