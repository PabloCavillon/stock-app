export type PriceInfo = {
    dollarRate: number;
    shippingPct: number;
    profitPct: number;
};

export function calcPriceArs(priceUsd: number, config: PriceInfo): number {
    return Math.round(
        priceUsd *
        config.dollarRate *
        (1 + config.shippingPct / 100) *
        (1 + config.profitPct / 100)
    );
}
