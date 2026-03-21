import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "LOrdEnRYQuE | Premium Web & AI Products",
  description: "Attila Lazar, founder of LOrdEnRYQuE — building websites, web apps, AI workflows, and design systems for real businesses.",
  icons: {
    icon: "/assets/logo.png", // We'll make sure this exists
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
