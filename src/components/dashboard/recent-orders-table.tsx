import Link from "next/link"
import { Calendar, Eye, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"
import { STATUS_LABEL } from '../../types/order-status';
import OrderStatusTooltip from "../orders/order-status-tooltip";
import { ChartOrder } from "@/types/order";


export function RecentOrdersTable({ orders }: { orders: ChartOrder[] }) {

    const thClasses = "px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] text-left";

    return (
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-100 rounded-xl text-zinc-900 shrink-0">
                        <ShoppingBag size={18} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">Últimas Órdenes</h2>
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Actividad reciente del sistema</p>
                    </div>
                </div>
                <Link href="/orders" className="text-xs font-bold text-zinc-400 hover:text-zinc-900 uppercase tracking-widest transition-colors">
                    Ver todas
                </Link>
            </div>

            {/* DESKTOP */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-zinc-100">
                            <th className={thClasses}>Cliente</th>
                            <th className={thClasses}>Estado</th>
                            <th className={thClasses}>Total</th>
                            <th className={thClasses}>Fecha</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center text-zinc-400 italic font-light">
                                    No hay órdenes registradas todavía.
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id} className="group hover:bg-zinc-50/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-base text-zinc-900">{order.customerName}</td>
                                    <td className="px-6 py-4"><OrderStatusTooltip order={order} /></td>
                                    <td className="px-6 py-4 font-bold text-base text-zinc-900">
                                        ${Number(order.total).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-zinc-400">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5 text-zinc-300" />
                                            {new Date(order.createdAt).toLocaleDateString('es-AR')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/admin/orders/${order.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-white border border-transparent hover:border-zinc-200 transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0">
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* MOBILE */}
            <div className="flex flex-col divide-y divide-zinc-100 md:hidden">
                {orders.length === 0 ? (
                    <p className="py-12 text-center text-zinc-400 italic font-light text-sm">No hay órdenes registradas todavía.</p>
                ) : (
                    orders.map((order) => (
                        <div key={order.id} className="flex items-start justify-between px-4 py-4">
                            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                                <p className="font-bold text-base text-zinc-900">{order.customerName}</p>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <OrderStatusTooltip order={order} />
                                    <span className="text-sm text-zinc-400 flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5 text-zinc-300" />
                                        {new Date(order.createdAt).toLocaleDateString('es-AR')}
                                    </span>
                                </div>
                                <span className="font-bold text-base text-zinc-900">
                                    ${Number(order.total).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                            <Link href={`/admin/orders/${order.id}`} className="ml-3 shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-white border border-transparent hover:border-zinc-200 transition-all">
                                <Eye className="w-4 h-4" />
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}