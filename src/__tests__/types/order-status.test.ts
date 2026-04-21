import { describe, it, expect } from "vitest";
import {
    STATUS_FLOW,
    STATUS_LABEL,
    STATUS_STYLE,
    STATUS_DESCRIPTION,
    STORE_STATUS_FLOW,
    STORE_STATUS_LABEL,
    STORE_STATUS_STYLE,
} from "@/types/order-status";
import { OrderStatus, StoreOrderStatus } from "@/generated/prisma/enums";

// ── STATUS_FLOW (admin orders) ────────────────────────────────────────────────

describe("STATUS_FLOW — transiciones de órdenes admin", () => {
    it("PENDING → CONFIRMED", () => {
        expect(STATUS_FLOW[OrderStatus.PENDING]).toBe("CONFIRMED");
    });

    it("CONFIRMED → SHIPPED", () => {
        expect(STATUS_FLOW[OrderStatus.CONFIRMED]).toBe("SHIPPED");
    });

    it("SHIPPED → DELIVERED", () => {
        expect(STATUS_FLOW[OrderStatus.SHIPPED]).toBe("DELIVERED");
    });

    it("DELIVERED es estado terminal (null)", () => {
        expect(STATUS_FLOW[OrderStatus.DELIVERED]).toBeNull();
    });

    it("CANCELLED es estado terminal (null)", () => {
        expect(STATUS_FLOW[OrderStatus.CANCELLED]).toBeNull();
    });

    it("todos los estados tienen una transición definida", () => {
        for (const status of Object.values(OrderStatus)) {
            expect(STATUS_FLOW).toHaveProperty(status);
        }
    });
});

// ── STATUS_LABEL ──────────────────────────────────────────────────────────────

describe("STATUS_LABEL — etiquetas legibles", () => {
    it("PENDING → 'Pendiente'", () => {
        expect(STATUS_LABEL[OrderStatus.PENDING]).toBe("Pendiente");
    });

    it("DELIVERED → 'Entregado'", () => {
        expect(STATUS_LABEL[OrderStatus.DELIVERED]).toBe("Entregado");
    });

    it("CANCELLED → 'Cancelado'", () => {
        expect(STATUS_LABEL[OrderStatus.CANCELLED]).toBe("Cancelado");
    });

    it("todos los estados tienen etiqueta", () => {
        for (const status of Object.values(OrderStatus)) {
            expect(STATUS_LABEL[status]).toBeTruthy();
        }
    });
});

// ── STATUS_STYLE ──────────────────────────────────────────────────────────────

describe("STATUS_STYLE — clases CSS de color", () => {
    it("todos los estados tienen estilos", () => {
        for (const status of Object.values(OrderStatus)) {
            expect(STATUS_STYLE[status]).toBeTruthy();
        }
    });

    it("cada estilo contiene clases de fondo y texto", () => {
        for (const style of Object.values(STATUS_STYLE)) {
            expect(style).toMatch(/bg-/);
            expect(style).toMatch(/text-/);
        }
    });
});

// ── STATUS_DESCRIPTION ────────────────────────────────────────────────────────

describe("STATUS_DESCRIPTION — descripciones", () => {
    it("todos los estados tienen descripción", () => {
        for (const status of Object.values(OrderStatus)) {
            expect(STATUS_DESCRIPTION[status]).toBeTruthy();
        }
    });
});

// ── STORE_STATUS_FLOW ─────────────────────────────────────────────────────────

describe("STORE_STATUS_FLOW — transiciones de órdenes tienda", () => {
    it("PENDING → PAYMENT_REGISTERED", () => {
        expect(STORE_STATUS_FLOW[StoreOrderStatus.PENDING]).toBe(StoreOrderStatus.PAYMENT_REGISTERED);
    });

    it("PAYMENT_REGISTERED → CONFIRMED", () => {
        expect(STORE_STATUS_FLOW[StoreOrderStatus.PAYMENT_REGISTERED]).toBe(StoreOrderStatus.CONFIRMED);
    });

    it("CONFIRMED → SHIPPED", () => {
        expect(STORE_STATUS_FLOW[StoreOrderStatus.CONFIRMED]).toBe(StoreOrderStatus.SHIPPED);
    });

    it("SHIPPED → DELIVERED", () => {
        expect(STORE_STATUS_FLOW[StoreOrderStatus.SHIPPED]).toBe(StoreOrderStatus.DELIVERED);
    });

    it("DELIVERED es estado terminal (null)", () => {
        expect(STORE_STATUS_FLOW[StoreOrderStatus.DELIVERED]).toBeNull();
    });

    it("CANCELLED es estado terminal (null)", () => {
        expect(STORE_STATUS_FLOW[StoreOrderStatus.CANCELLED]).toBeNull();
    });

    it("todos los estados tienen una transición definida", () => {
        for (const status of Object.values(StoreOrderStatus)) {
            expect(STORE_STATUS_FLOW).toHaveProperty(status);
        }
    });

    it("la cadena completa llega a null sin ciclos", () => {
        let current: StoreOrderStatus | null = StoreOrderStatus.PENDING;
        const visited = new Set<StoreOrderStatus>();
        while (current !== null) {
            expect(visited.has(current)).toBe(false);
            visited.add(current);
            current = STORE_STATUS_FLOW[current];
        }
    });
});

// ── STORE_STATUS_LABEL ────────────────────────────────────────────────────────

describe("STORE_STATUS_LABEL — etiquetas tienda", () => {
    it("PENDING → 'Pendiente'", () => {
        expect(STORE_STATUS_LABEL[StoreOrderStatus.PENDING]).toBe("Pendiente");
    });

    it("PAYMENT_REGISTERED tiene etiqueta", () => {
        expect(STORE_STATUS_LABEL[StoreOrderStatus.PAYMENT_REGISTERED]).toBeTruthy();
    });

    it("DELIVERED → 'Entregado'", () => {
        expect(STORE_STATUS_LABEL[StoreOrderStatus.DELIVERED]).toBe("Entregado");
    });

    it("CANCELLED → 'Cancelado'", () => {
        expect(STORE_STATUS_LABEL[StoreOrderStatus.CANCELLED]).toBe("Cancelado");
    });

    it("todos los estados tienen etiqueta", () => {
        for (const status of Object.values(StoreOrderStatus)) {
            expect(STORE_STATUS_LABEL[status]).toBeTruthy();
        }
    });
});

// ── STORE_STATUS_STYLE ────────────────────────────────────────────────────────

describe("STORE_STATUS_STYLE — clases CSS tienda", () => {
    it("todos los estados tienen estilos", () => {
        for (const status of Object.values(StoreOrderStatus)) {
            expect(STORE_STATUS_STYLE[status]).toBeTruthy();
        }
    });

    it("cada estilo contiene clases de fondo, texto y borde", () => {
        for (const style of Object.values(STORE_STATUS_STYLE)) {
            expect(style).toMatch(/bg-/);
            expect(style).toMatch(/text-/);
            expect(style).toMatch(/border-/);
        }
    });
});
