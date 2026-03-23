import type { Metadata } from "next";
import "@fontsource-variable/mona-sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lubin – Dr. Carol Morgan",
  description: "Coach profile page",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen" suppressHydrationWarning>{children}</body>
    </html>
  );
}
