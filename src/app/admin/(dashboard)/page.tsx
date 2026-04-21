import { getDashboardData } from "@/actions/dashboard";
import { LowStockTable } from "@/components/dashboard/low-stock-table";
import { OrdersByStatusChart } from "@/components/dashboard/orders-by-status-chart";
import { RecentOrdersTable } from "@/components/dashboard/recent-orders-table";
import { SalesByMonthChart } from "@/components/dashboard/sales-by-month-chart";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { TopProductsChart } from "@/components/dashboard/top-products-chart";

export default async function DashboardPage() {
    const data = await getDashboardData();
    return (
        <div className="p-4 md:p-8 flex flex-col gap-6">
            <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tighter text-zinc-900">Dashboard</h1>
                <p className="text-sm text-zinc-500 mt-1">Resumen de tu tienda</p>
            </div>

            <StatsCards stats={data.stats} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SalesByMonthChart data={data.salesByMonth} />
                <TopProductsChart data={data.topProducts} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <OrdersByStatusChart data={data.ordersByStatus} />
                <div className="lg:col-span-2">
                    <RecentOrdersTable orders={data.recentOrders} />
                </div>
            </div>

            <LowStockTable products={data.lowStockProducts} />
        </div>
    );
}