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

export const metadata: Metadata = {
	title: {
		template: "%s | Projaska",
		default: "Projaska",
	},
	description: "Sistema de gestión de inventario y tienda para Projaska — tecnología y seguridad.",
	authors: [{ name: "Projaska" }],
	creator: "Projaska",
	icons: {
		icon: "/icon-192.png",
		apple: "/icon-192.png",
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