import { cn } from "@/lib/utils"

type Stats = {
    totalProducts: number
    totalCustomers: number
    totalOrders: number
    lowStockCount: number
}

const cards = [
    {
        key: "totalProducts",
        label: "Products",
        icon: (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11" />
            </svg>
        ),
    },
    {
        key: "totalCustomers",
        label: "Customers",
        icon: (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        key: "totalOrders",
        label: "Orders",
        icon: (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
        ),
    },
    {
        key: "lowStockCount",
        label: "Low stock",
        icon: (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
        ),
        warning: true,
    },
]

export function StatsCards({ stats }: { stats: Stats }) {
    return (
        <div className="grid grid-cols-4 gap-4">
            {cards.map((card) => {
                const value = stats[card.key as keyof Stats]
                return (
                    <div
                        key={card.key}
                        className={cn(
                            "bg-white rounded-xl border p-5 flex items-center gap-4",
                            card.warning && value > 0
                                ? "border-amber-200"
                                : "border-gray-200"
                        )}
                    >
                        <div className={cn(
                            "p-2 rounded-lg",
                            card.warning && value > 0
                                ? "bg-amber-50 text-amber-600"
                                : "bg-gray-100 text-gray-600"
                        )}>
                            {card.icon}
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-gray-900">{value}</p>
                            <p className="text-sm text-gray-500">{card.label}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}