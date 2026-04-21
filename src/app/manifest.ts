import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Projaska — Tecnología y Seguridad",
        short_name: "Projaska",
        description: "Tienda online de tecnología y seguridad para profesionales.",
        start_url: "/",
        display: "standalone",
        background_color: "#f7f8fa",
        theme_color: "#111827",
        icons: [
            {
                src: "/icon-192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/icon-512.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}
