import {Inter, Montserrat} from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
})

export const metadata = {
  title: "binmaster auction",
  description: "Webpage Integration for binmaster",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`font-[${inter.variable}] bg-background text-primary w-screen h-screen`}>
        {children}
      </body>
    </html>
  );
}
