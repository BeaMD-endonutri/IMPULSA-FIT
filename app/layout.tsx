import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IMPULSA FIT | Entrenamiento EMS en Huelva",
  description: "Entrenamiento WB-EMS personalizado y supervisado en Huelva. Conoce sus beneficios, límites y seguridad con evidencia científica.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
