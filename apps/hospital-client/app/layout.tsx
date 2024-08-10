import type { Metadata } from "next";
import { Merriweather_Sans } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
    title: "Clinqo",
    description: "Best queue managment software",
};

const merriweatherSanas = Merriweather_Sans({ subsets: ["latin"], display: "swap" });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={merriweatherSanas.className}>{children}</body>
        </html>
    );
}
