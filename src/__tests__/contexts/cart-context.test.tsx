import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProvider, useCart, CartItem } from "@/contexts/cart-context";

// ── helpers ──────────────────────────────────────────────────────────────────

function CartTestConsumer() {
    const { items, addItem, removeItem, updateQuantity, clearCart, itemCount } = useCart();
    return (
        <div>
            <span data-testid="count">{itemCount}</span>
            <span data-testid="items">{JSON.stringify(items)}</span>
            <button onClick={() => addItem(productA)}>add-a</button>
            <button onClick={() => addItem(productB)}>add-b</button>
            <button onClick={() => removeItem(productA.cartKey)}>remove-a</button>
            <button onClick={() => updateQuantity(productA.cartKey, 5)}>set-5</button>
            <button onClick={() => updateQuantity(productA.cartKey, 0)}>set-0</button>
            <button onClick={() => clearCart()}>clear</button>
        </div>
    );
}

const productA: Omit<CartItem, "quantity"> = {
    cartKey: "product:aaa",
    type: "product",
    id: "aaa",
    name: "Producto A",
    sku: "SKU-A",
    priceUsd: 100,
};

const productB: Omit<CartItem, "quantity"> = {
    cartKey: "product:bbb",
    type: "product",
    id: "bbb",
    name: "Producto B",
    sku: "SKU-B",
    priceUsd: 200,
};

function setup() {
    render(
        <CartProvider>
            <CartTestConsumer />
        </CartProvider>
    );
    const user = userEvent.setup();
    const count = () => screen.getByTestId("count").textContent;
    const items = () => JSON.parse(screen.getByTestId("items").textContent!);
    return { user, count, items };
}

// ── tests ────────────────────────────────────────────────────────────────────

beforeEach(() => {
    localStorage.clear();
});

describe("CartProvider — addItem", () => {
    it("agrega un ítem nuevo con quantity 1", async () => {
        const { user, count, items } = setup();
        await user.click(screen.getByText("add-a"));
        expect(count()).toBe("1");
        expect(items()[0].quantity).toBe(1);
    });

    it("incrementa quantity si el ítem ya existe", async () => {
        const { user, count, items } = setup();
        await user.click(screen.getByText("add-a"));
        await user.click(screen.getByText("add-a"));
        expect(count()).toBe("2");
        expect(items()).toHaveLength(1);
        expect(items()[0].quantity).toBe(2);
    });

    it("agrega ítems distintos como entradas separadas", async () => {
        const { user, count, items } = setup();
        await user.click(screen.getByText("add-a"));
        await user.click(screen.getByText("add-b"));
        expect(count()).toBe("2");
        expect(items()).toHaveLength(2);
    });
});

describe("CartProvider — removeItem", () => {
    it("elimina el ítem del carrito", async () => {
        const { user, count, items } = setup();
        await user.click(screen.getByText("add-a"));
        await user.click(screen.getByText("remove-a"));
        expect(count()).toBe("0");
        expect(items()).toHaveLength(0);
    });

    it("no falla si el ítem no existe", async () => {
        const { user, count } = setup();
        await user.click(screen.getByText("remove-a"));
        expect(count()).toBe("0");
    });
});

describe("CartProvider — updateQuantity", () => {
    it("actualiza la cantidad del ítem", async () => {
        const { user, items } = setup();
        await user.click(screen.getByText("add-a"));
        await user.click(screen.getByText("set-5"));
        expect(items()[0].quantity).toBe(5);
    });

    it("elimina el ítem si la nueva cantidad es 0", async () => {
        const { user, items } = setup();
        await user.click(screen.getByText("add-a"));
        await user.click(screen.getByText("set-0"));
        expect(items()).toHaveLength(0);
    });
});

describe("CartProvider — clearCart", () => {
    it("vacía el carrito completamente", async () => {
        const { user, count, items } = setup();
        await user.click(screen.getByText("add-a"));
        await user.click(screen.getByText("add-b"));
        await user.click(screen.getByText("clear"));
        expect(count()).toBe("0");
        expect(items()).toHaveLength(0);
    });
});

describe("CartProvider — itemCount", () => {
    it("suma las quantities de todos los ítems", async () => {
        const { user, count } = setup();
        await user.click(screen.getByText("add-a")); // qty: 1
        await user.click(screen.getByText("add-a")); // qty: 2
        await user.click(screen.getByText("add-b")); // qty: 1
        expect(count()).toBe("3");
    });
});

describe("CartProvider — persistencia localStorage", () => {
    it("carga el carrito guardado al montar", async () => {
        const stored = [{ ...productA, quantity: 3 }];
        localStorage.setItem("projaska_cart_v2", JSON.stringify(stored));
        const { count } = setup();
        // El efecto es asíncrono — esperamos que el DOM actualice
        await act(async () => {});
        expect(count()).toBe("3");
    });
});

describe("useCart — fuera de CartProvider", () => {
    it("lanza un error", () => {
        // Silenciamos el error de consola esperado
        const spy = vi.spyOn(console, "error").mockImplementation(() => {});
        expect(() => render(<CartTestConsumer />)).toThrow("useCart must be used within CartProvider");
        spy.mockRestore();
    });
});
