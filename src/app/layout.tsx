import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import ClientLayout from "./client-layout"; // Import the new client layout

export const metadata: Metadata = {
  title: "DueFlow",
  description: "Automate your business follow-ups with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
      </head>
      <body className={cn("font-body antialiased", "min-h-screen bg-background")}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
