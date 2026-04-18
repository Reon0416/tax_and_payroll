import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "給与手取りシミュレーター（概算）",
  description: "年収・月収・賞与条件から手取りを詳細に比較できる概算シミュレーター",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
