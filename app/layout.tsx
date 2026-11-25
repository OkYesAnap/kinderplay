import type {Metadata} from "next";
import {Shantell_Sans} from "next/font/google";
import "./globals.css";
import {AuthProvider} from "./components/AuthProvider";
import {StoreProvider} from "@/app/components/StoreProvider";
import {AppInitializer} from "./components/AppInitializer";

const shantellSans = Shantell_Sans({
    variable: "--font-shantell-sans",
    subsets: ["latin", "cyrillic"],
    weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
    title: "KinderPlay",
    description: "A fun space for wishes, games, and movies",
};

export default function RootLayout({children}: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={`${shantellSans.variable} h-full antialiased`}
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
