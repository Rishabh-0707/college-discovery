import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import AIChatbot from "@/components/AIChatbot";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: '--font-sans',
  display: 'swap' 
});

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: '--font-serif',
  display: 'swap' 
});

export const metadata: Metadata = {
  title: "CollegeQ | Academic Excellence",
  description: "Elevate your academic journey and discover extraordinary institutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans min-h-screen bg-white text-[#111] antialiased flex flex-col selection:bg-[#E81A2D] selection:text-white`}>
        <Providers>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <AIChatbot />
        </Providers>
      </body>
    </html>
  );
}
