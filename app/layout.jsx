import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";
import PageTransition from "@/components/PageTransition.jsx";
import { Montserrat, Playfair_Display, Noto_Sans_Devanagari } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "600", "700", "800", "900"],
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["latin", "devanagari"],
  variable: "--font-devanagari",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});
export const metadata = {
  title: "Drago Pharma | Peptides for Revitalization & Health",
  description:
    "Drago Pharma - premium research peptides for laboratory and investigational use.",
  icons: { icon: "/images/logo.webp" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${playfair.variable} ${notoDevanagari.variable}`}>
      <head>
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main>
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
