import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from "@react-pdf/renderer";
import { SerializedOrder } from "@/types/order";
import { OrderStatus } from "@/generated/prisma/enums";

const styles = StyleSheet.create({
    page: {
        fontFamily: "Helvetica",
        fontSize: 10,
        padding: 40,
        color: "#1a1a1a",
        backgroundColor: "#ffffff",
    },
    // ── Header ──────────────────────────────────────
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 30,
        paddingBottom: 20,
        borderBottom: "1px solid #e5e7eb",
    },
    businessBlock: {
        flexDirection: "column",
        gap: 3,
    },
    logo: {
        width: 60,
        height: 60,
        objectFit: "contain",
    },
    businessName: {
        fontSize: 16,
        fontFamily: "Helvetica-Bold",
        color: "#111827",
    },
    businessDetail: {
        fontSize: 9,
        color: "#6b7280",
    },
    receiptBlock: {
        alignItems: "flex-end",
        gap: 3,
    },
    receiptTitle: {
        fontSize: 20,
        fontFamily: "Helvetica-Bold",
        color: "#111827",
        letterSpacing: 1,
    },
    receiptCode: {
        fontSize: 11,
        fontFamily: "Helvetica-Bold",
        color: "#4b5563",
    },
    receiptDate: {
        fontSize: 9,
        color: "#9ca3af",
    },
    // ── Info Section ────────────────────────────────
    infoSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 28,
        gap: 20,
    },
    infoBlock: {
        flex: 1,
        padding: 14,
        backgroundColor: "#f9fafb",
        borderRadius: 4,
        gap: 4,
    },
    infoLabel: {
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
        color: "#9ca3af",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 10,
        color: "#111827",
    },
    infoValueMuted: {
        fontSize: 9,
        color: "#6b7280",
    },
    // ── Items Table ──────────────────────────────────
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#111827",
        padding: "8 10",
        borderRadius: 4,
        marginBottom: 2,
    },
    tableHeaderText: {
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
        color: "#ffffff",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    tableRow: {
        flexDirection: "row",
        padding: "9 10",
        borderBottom: "1px solid #f3f4f6",
    },
    tableRowAlt: {
        backgroundColor: "#f9fafb",
    },
    colProduct: { flex: 3 },
    colSku: { flex: 2 },
    colQty: { flex: 1, textAlign: "center" },
    colPrice: { flex: 2, textAlign: "right" },
    colSubtotal: { flex: 2, textAlign: "right" },
    cellText: {
        fontSize: 9,
        color: "#374151",
    },
    cellTextBold: {
        fontSize: 9,
        fontFamily: "Helvetica-Bold",
        color: "#111827",
    },
    // ── Totals ───────────────────────────────────────
    totalsSection: {
        marginTop: 16,
        alignItems: "flex-end",
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 40,
        marginBottom: 4,
    },
    totalLabel: {
        fontSize: 9,
        color: "#6b7280",
        width: 80,
        textAlign: "right",
    },
    totalValue: {
        fontSize: 10,
        color: "#111827",
        width: 80,
        textAlign: "right",
    },
    grandTotalRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 40,
        marginTop: 8,
        paddingTop: 8,
        borderTop: "1px solid #e5e7eb",
    },
    grandTotalLabel: {
        fontSize: 11,
        fontFamily: "Helvetica-Bold",
        color: "#111827",
        width: 80,
        textAlign: "right",
    },
    grandTotalValue: {
        fontSize: 11,
        fontFamily: "Helvetica-Bold",
        color: "#111827",
        width: 80,
        textAlign: "right",
    },
    dollarRate: {
        fontSize: 8,
        color: "#9ca3af",
        marginTop: 4,
        textAlign: "right",
    },
    // ── Status Badge ─────────────────────────────────
    statusBadge: {
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 99,
        alignSelf: "flex-start",
    },
    statusText: {
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    // ── Footer ───────────────────────────────────────
    footer: {
        position: "absolute",
        bottom: 30,
        left: 40,
        right: 40,
        flexDirection: "row",
        justifyContent: "space-between",
        borderTop: "1px solid #e5e7eb",
        paddingTop: 10,
    },
    footerText: {
        fontSize: 8,
        color: "#9ca3af",
    },
});

const STATUS_CONFIG: Record<OrderStatus, { label: string, bg: string, color: string }> = {
    PENDING: { label: 'Pendiente', bg: '#fef9c3', color: '#854d0e' },
    CONFIRMED: { label: 'Confirmada', bg: '#dcfce7', color: '#166534' },
    SHIPPED: { label: 'Enviada', bg: '#dbeafe', color: '#1e40af' },
    DELIVERED: { label: 'Entregada', bg: '#f0fdf4', color: '#15803d' },
    CANCELLED: { label: 'Cancelada', bg: '#fee2e2', color: '#991b1b' },
}

const BUSINESS = {
    name: "Projaska",
    address: "Salta, Argentina",
    phone: '+54 3873 44-3522',
    email: 'info@projaska.com',
    //web: 'projaska.com'
    //logoUrl: '/logo.png'
}

const fmt = (n: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(n);

const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

interface OrderReceiptProps {
    order: SerializedOrder
}

export function OrderReceipt({ order }: OrderReceiptProps) {

    const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING;

    return (
        <Document>
            <Page size='A4' style={styles.page}>
                <View style={styles.header}>
                    <View style={styles.businessBlock}>
                        <Text style={styles.businessName}>{BUSINESS.name}</Text>
                        <Text style={styles.businessDetail}>{BUSINESS.address}</Text>
                        <Text style={styles.businessDetail}>{BUSINESS.phone}</Text>
                        <Text style={styles.businessDetail}>{BUSINESS.email}</Text>
                    </View>
                    <View style={styles.receiptBlock}>
                        <Text style={styles.receiptTitle}>RECIBO</Text>
                        <Text style={styles.receiptCode}>{order.code}</Text>
                        <Text style={styles.receiptDate}>{fmtDate(order.createdAt)}</Text>
                    </View>
                </View>
                {/* ── Info: Cliente + Orden ── */}
                <View style={styles.infoSection}>
                    <View style={styles.infoBlock}>
                        <Text style={styles.infoLabel}>Cliente</Text>
                        <Text style={styles.infoValue}>{order.customer.name}</Text>
                        {order.customer.email && (
                            <Text style={styles.infoValueMuted}>{order.customer.email}</Text>
                        )}
                        {order.customer.phone && (
                            <Text style={styles.infoValueMuted}>{order.customer.phone}</Text>
                        )}
                        {order.customer.address && (
                            <Text style={styles.infoValueMuted}>{order.customer.address}</Text>
                        )}
                    </View>

                    <View style={styles.infoBlock}>
                        <Text style={styles.infoLabel}>Orden</Text>
                        <Text style={styles.infoValue}>
                            Código: {order.code ?? "—"}
                        </Text>
                        <Text style={styles.infoValueMuted}>
                            Vendedor: {order.user.username}
                        </Text>
                        <View style={{ marginTop: 6 }}>
                            <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                                <Text style={[styles.statusText, { color: status.color }]}>
                                    {status.label}
                                </Text>
                            </View>
                        </View>
                        {order.notes && (
                            <Text style={[styles.infoValueMuted, { marginTop: 6 }]}>
                                Nota: {order.notes}
                            </Text>
                        )}
                    </View>
                </View>

                {/* ── Items Table ── */}
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, styles.colProduct]}>Producto</Text>
                    <Text style={[styles.tableHeaderText, styles.colSku]}>SKU</Text>
                    <Text style={[styles.tableHeaderText, styles.colQty]}>Cant.</Text>
                    <Text style={[styles.tableHeaderText, styles.colPrice]}>Precio Unit.</Text>
                    <Text style={[styles.tableHeaderText, styles.colSubtotal]}>Subtotal</Text>
                </View>

                {order.items.map((item, i) => (
                    <View
                        key={item.id}
                        style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}
                    >
                        <Text style={[styles.cellTextBold, styles.colProduct]}>
                            {item.product.name}
                        </Text>
                        <Text style={[styles.cellText, styles.colSku]}>
                            {item.product.sku}
                        </Text>
                        <Text style={[styles.cellText, styles.colQty]}>
                            {item.quantity}
                        </Text>
                        <Text style={[styles.cellText, styles.colPrice]}>
                            {fmt(item.unitPrice)}
                        </Text>
                        <Text style={[styles.cellTextBold, styles.colSubtotal]}>
                            {fmt(item.unitPrice * item.quantity)}
                        </Text>
                    </View>
                ))}

                {/* ── Totals ── */}
                <View style={styles.totalsSection}>
                    <View style={styles.grandTotalRow}>
                        <Text style={styles.grandTotalLabel}>TOTAL</Text>
                        <Text style={styles.grandTotalValue}>{fmt(order.total)}</Text>
                    </View>
                    {order.dollarRate && (
                        <Text style={styles.dollarRate}>
                            Tipo de cambio al momento de la orden: $
                            {Number(order.dollarRate).toLocaleString("es-AR")} ARS/USD
                        </Text>
                    )}
                </View>

                {/* ── Footer ── */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>{BUSINESS.name} — {BUSINESS.email}</Text>
                    <Text style={styles.footerText}>
                        Generado el{" "}
                        {new Date().toLocaleDateString("es-AR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        })}
                    </Text>
                </View>
            </Page>
        </Document>
    )
}