'use client';

import { FirebaseClientProvider } from "@/firebase";
import { Toaster } from "@/components/ui/toaster";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <FirebaseClientProvider>
            {children}
            <Toaster />
        </FirebaseClientProvider>
    );
}
