import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DEADLINE — Track What Matters",
  description: "A brutal deadline tracker. No excuses.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
