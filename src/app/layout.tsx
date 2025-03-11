import type { Metadata } from "next";
import QueryProvider from "~/react-query/QueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adopt-a-Pup",
  description: "Take-home assessment for Fetch Rewards",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <QueryProvider>
        <body className="flex h-screen flex-col">{children}</body>
      </QueryProvider>
    </html>
  );
}
