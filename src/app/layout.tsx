import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthInitializer } from "@/components/providers/auth-initializer";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trippi",
  description: "Trippi is a platform for trip planning and management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthInitializer>
          <QueryProvider>{children}</QueryProvider>
        </AuthInitializer>
        <ToastContainer />
      </body>
    </html>
  );
}
