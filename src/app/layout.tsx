// src/app/layout.tsx - Root Layout without Navbar
import { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Auth Demo - Spring Boot + Next.js",
  description:
    "A simple authentication system with Spring Boot backend and Next.js frontend",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <div className="layout">
          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
