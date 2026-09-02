import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";
import PageTransition from "@/components/PageTransition.jsx";

export const metadata = {
  title: "Drago Pharma | Peptides for Revitalization & Health",
  description:
    "Drago Pharma - premium research peptides for laboratory and investigational use.",
  icons: { icon: "/images/logo.webp" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&family=Roboto+Slab:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
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
