import "./globals.scss";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ClassLog",
  manifest: "./manifest.webmanifest",
  themeColor: "#ffffff",
  appleWebApp: {
    capable: true,
    title: "ClassLog",
    statusBarStyle: "default",
  },
  icons: {
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    icon: [
      {
        url: "/favicon/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: "/favicon/favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/favicon/favicon.ico",
        type: "image/x-icon",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      {children}
    </html>
  );
}
