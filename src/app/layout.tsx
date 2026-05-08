import type { Metadata } from "next";
import { Inter, Alexandria } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const alexandria = Alexandria({ 
  subsets: ["arabic", "latin"], 
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-alexandria" 
});

export const metadata: Metadata = {
  title: "یادگاری شەهیدان | Memorial of Kurdish Martyrs",
  description: "گەورەترین پلاتفۆرم بۆ یادکردنەوەی شەهیدانی کوردستان",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ku" dir="rtl" suppressHydrationWarning>
      <body className={`${inter.variable} ${alexandria.variable} antialiased font-kurdish selection:bg-brand-red selection:text-white`}>
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
