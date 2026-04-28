import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://projaska.com";

export const metadata: Metadata = {
	metadataBase: new URL(BASE_URL),
	title: {
		template: "%s | Projaska",
		default: "Projaska — Tecnología y Seguridad",
	},
	description: "Tienda online de tecnología y seguridad para profesionales. Cámaras, alarmas, cerraduras y más con envío a todo el país.",
	keywords: ["tecnología", "seguridad", "cámaras", "alarmas", "cerraduras", "domótica", "Projaska"],
	authors: [{ name: "Projaska" }],
	creator: "Projaska",
	robots: { index: true, follow: true },
	openGraph: {
		type: "website",
		locale: "es_AR",
		url: BASE_URL,
		siteName: "Projaska",
		title: "Projaska — Tecnología y Seguridad",
		description: "Tienda online de tecnología y seguridad para profesionales. Cámaras, alarmas, cerraduras y más.",
		images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "Projaska" }],
	},
	twitter: {
		card: "summary",
		title: "Projaska — Tecnología y Seguridad",
		description: "Tienda online de tecnología y seguridad para profesionales.",
		images: ["/icon-512.png"],
	},
	icons: {
		icon: [
			{ url: "/icon-192.png", type: "image/png", sizes: "192x192" },
			{ url: "/icon-512.png", type: "image/png", sizes: "512x512" },
		],
		apple: { url: "/icon-192.png", sizes: "192x192" },
		shortcut: "/favicon.ico",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="es"
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
			suppressHydrationWarning
		>
			<head>
				<meta name="theme-color" content="#111827" />
				{/* Aplica el tema antes de que React hidrate para evitar flash */}
				<script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('theme');if(t==='dark'||(t===null&&matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}` }} />
			</head>
			<body className="min-h-full flex flex-col">
				{children}
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}