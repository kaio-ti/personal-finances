"use client";

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Personal Finance Manager",
//   description: "Manage your personal finances with ease",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const handleChunkLoadError = (error: Event | any) => {
      if (error?.message?.includes("ChunkLoadError")) {
        console.error(
          "Erro de carregamento de chunk detectado! Recarregando..."
        );
        toast.error("Erro ao carregar recursos da aplicação. Atualizando...");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    };

    window.addEventListener("error", handleChunkLoadError);
    return () => {
      window.removeEventListener("error", handleChunkLoadError);
    };
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
