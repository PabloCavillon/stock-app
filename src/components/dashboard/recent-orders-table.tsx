import Link from "next/link"
import { Calendar, Eye, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"
import { STATUS_LABEL } from '../../types/order-status';
import OrderStatusTooltip from "../orders/order-status-tooltip";
import { ChartOrder } from "@/types/order";


export function RecentOrdersTable({ orders }: { orders: ChartOrder[] }) {

    const thClasses = "px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] text-left";

    return (
        <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
            <div className="px-6 py-5 border-b border-zinc-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-100 rounded-xl text-zinc-900">
                        <ShoppingBag size={18} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">
                            Últimas Órdenes
                        </h2>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            Actividad reciente del sistema
                        </p>
                    </div>
                </div>

                <Link
                    href="/orders"
                    className="text-[10px] font-bold text-zinc-400 hover:text-zinc-900 uppercase tracking-widest transition-colors"
                >
                    Ver todas
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-zinc-50">
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
                                    <td className="px-6 py-4 font-bold text-zinc-900">
                                        {order.customerName}
                                    </td>

                                    <td className="px-6 py-4">
                                        <OrderStatusTooltip order={order} />
                                    </td>

                                    <td className="px-6 py-4 font-bold text-zinc-900">
                                        ${Number(order.total).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                    </td>

                                    <td className="px-6 py-4 text-zinc-400 text-xs">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5 text-zinc-300" />
                                            {new Date(order.createdAt).toLocaleDateString('es-AR')}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/orders/${order.id}`}
                                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-white border border-transparent hover:border-zinc-200 transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}