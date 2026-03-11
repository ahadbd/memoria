import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Memoria | AI-First Study Platform",
  description: "High-performance study platform optimized for the agentic era.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { primaryColor: "#6366f1" },
      }}
    >
      <html lang="en" className="dark" suppressHydrationWarning>
        <body className={`${inter.className} bg-slate-950 text-slate-50 antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
