import type { Metadata } from "next";
import { cn } from "@/src/lib/utils";
import { Inter } from "next/font/google";

import "./globals.css";
import { Toaster } from "@/src/components/common/ui/toaster";
import AuthContext from "../context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CRAS App",
  description: "CRAS App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-gray-50 min-h-screen")}>
        <Toaster />
        <AuthContext>{children}</AuthContext>
      </body>
    </html>
  );
}
