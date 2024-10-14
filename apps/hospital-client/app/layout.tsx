import type { Metadata } from "next";
import { Merriweather_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import RecoilContextProvider from "./recoil-context-provider";

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
            <body className={merriweatherSanas.className}>
                <RecoilContextProvider>{children}</RecoilContextProvider>
                <Toaster />
            </body>
        </html>
    );
}
