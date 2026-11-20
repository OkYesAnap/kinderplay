import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {AuthProvider} from "./components/AuthProvider";
import {StoreProvider} from "@/app/components/StoreProvider";
import {AppInitializer} from "./components/AppInitializer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "KinderPlay",
    description: "A fun space for wishes, games, and movies",
};

export default function RootLayout({children}: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
        <body className="min-h-full flex flex-col">
        <AppInitializer>
            <StoreProvider>
                <AuthProvider>{children}</AuthProvider>
            </StoreProvider>
        </AppInitializer>
        </body>
        </html>
    );
}
