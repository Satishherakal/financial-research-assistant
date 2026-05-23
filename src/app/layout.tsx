import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinRA — Financial Research Assistant",
  description:
    "AI-powered financial research tool. Search any stock ticker to get real-time data, news sentiment analysis, and AI-generated investment insights.",
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
