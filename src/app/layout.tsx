import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "یادگاری شەهیدان | Memorial of Kurdish Martyrs",
  description: "پلاتفۆرمی یادکردنەوەی شەهیدانی کوردستان. پاراستنی مێژوو و قوربانیدانی قارەمانەکانمان.",
  keywords: "شەهید, کوردستان, پێشمەرگە, ئاسایش, یادگاری, Martyrs, Kurdistan, Peshmerga",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ckb" dir="rtl" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} antialiased selection:bg-brand-red selection:text-white`}>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
