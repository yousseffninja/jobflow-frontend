import type { Metadata } from "next";
import { Geist, Inter, JetBrains_Mono } from "next/font/google";
import { LocaleProvider } from "@/providers/locale-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
    title: "JobFlow",
    description: "AI-powered ATS Job Tracker",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <script
                dangerouslySetInnerHTML={{
                    __html: `
              (function() {
                try {
                  var locale = localStorage.getItem('locale') || 'en';
                  document.documentElement.lang = locale;
                  document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
                } catch (e) {}
              })();
            `,
                }}
            />
        </head>
            <body className={`${geist.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
                <ThemeProvider>
                    <LocaleProvider>
                        {children}
                    </LocaleProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}