
import { Aboreto, Montserrat } from "next/font/google";
import "./globals.css";
const aboreto = Aboreto({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-aboreto",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-montserrat",
});
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${aboreto.variable} ${montserrat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
