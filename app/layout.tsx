import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "James Benedict Pandio — Full Stack Developer & AI Automation",
  description:
    "Junior full stack developer from Pampanga, PH. I build apps and automate workflows with React, Next.js, Node, Postgres and AI.",
};

export const viewport: Viewport = {
  themeColor: "#0f0f0e",
};

// Applies the saved theme before first paint so there's no flash.
const themeScript = `try{var m=localStorage.getItem('jbp-theme');if(m)document.documentElement.dataset.theme=m}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="dark" className={geistMono.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
