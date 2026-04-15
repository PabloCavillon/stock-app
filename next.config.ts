import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	turbopack: {
		root: __dirname,
	},
	images: {
		remotePatterns: [
			{ protocol: "http", hostname: "googleusercontent.com" },
			{ protocol: "https", hostname: "googleusercontent.com" },
			{ protocol: "https", hostname: "*.googleusercontent.com" },
			{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
		],
	},
	async headers() {
		return [
			{
				source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
				headers: [
					{ key: "X-Frame-Options", value: "SAMEORIGIN" },
					{ key: "X-Content-Type-Options", value: "nosniff" },
					{
						key: "Referrer-Policy",
						value: "origin-when-cross-origin",
					},
					{
						key: "Strict-Transport-Security",
						value: "max-age=31536000; includeSubDomains; preload",
					},
					{
						key: "Content-Security-Policy",
						value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: http://googleusercontent.com https://googleusercontent.com https://*.googleusercontent.com https://*.public.blob.vercel-storage.com; font-src 'self';",
					},
				],
			},
		];
	},
};



export default nextConfig;
