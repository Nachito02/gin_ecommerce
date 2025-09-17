import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import WhatsappButton from "@/components/WhatsappButton";
import Footer from "@/components/Footer";
import LoginModal from "@/components/modals/LoginModal";
import RegisterModal from "@/components/modals/RegisterModal";
import { getCurrentUser } from "../actions/getCurrentUser";
import Header from "@/components/headers/Header";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gin Muebles",
  description: "Muebles para el hogar",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header currentUser={currentUser} />
        <LoginModal />
        <RegisterModal />
        {children}
        <WhatsappButton />
        <Footer />
      </body>
    </html>
  );
}
