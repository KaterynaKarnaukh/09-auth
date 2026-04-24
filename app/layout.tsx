import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import { AuthProvider } from "@/components/AuthProvider/AuthProvider";
 
const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});
 
export const metadata: Metadata = {
  title: "NoteHub",
  description:
    "NoteHub is a simple and efficient application for managing personal notes.",
  openGraph: {
    title: "NoteHub",
    description:
      "NoteHub is a simple and efficient application for managing personal notes.",
    url: "https://your-app-url.com",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub Preview",
      },
    ],
  },
};
 
interface RootLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}
 
export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en" className={roboto.variable}>
      <body>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            {children}
            {modal}
            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
 