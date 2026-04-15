import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeToggle } from "@/components/theme-toggle";

beforeEach(() => {
    document.documentElement.classList.remove("dark");
    localStorage.clear();
});

describe("ThemeToggle", () => {
    it("muestra el ícono de luna en modo claro", () => {
        render(<ThemeToggle />);
        // Moon icon tiene un aria-label de "Cambiar a modo oscuro"
        expect(screen.getByRole("button", { name: /oscuro/i })).toBeTruthy();
    });

    it("activa el modo oscuro al hacer click", async () => {
        const user = userEvent.setup();
        render(<ThemeToggle />);
        await user.click(screen.getByRole("button"));
        expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("guarda la preferencia en localStorage", async () => {
        const user = userEvent.setup();
        render(<ThemeToggle />);
        await user.click(screen.getByRole("button"));
        expect(localStorage.getItem("theme")).toBe("dark");
    });

    it("desactiva el modo oscuro en el segundo click", async () => {
        const user = userEvent.setup();
        render(<ThemeToggle />);
        await user.click(screen.getByRole("button")); // → dark
        await user.click(screen.getByRole("button")); // → light
        expect(document.documentElement.classList.contains("dark")).toBe(false);
        expect(localStorage.getItem("theme")).toBe("light");
    });

    it("muestra el ícono de sol cuando ya está en modo oscuro", async () => {
        document.documentElement.classList.add("dark");
        render(<ThemeToggle />);
        // Después del useEffect el botón debería decir "Cambiar a modo claro"
        const button = await screen.findByRole("button", { name: /claro/i });
        expect(button).toBeTruthy();
    });

    it("aplica className al botón", () => {
        render(<ThemeToggle className="custom-class" />);
        expect(screen.getByRole("button").className).toContain("custom-class");
    });

    it("muestra la etiqueta de texto cuando showLabel=true", async () => {
        render(<ThemeToggle showLabel />);
        // En modo claro, el label dice "Modo oscuro"
        expect(screen.getByText(/modo oscuro/i)).toBeTruthy();
    });
});
