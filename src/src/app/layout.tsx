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
          <nav className="navbar">
            <div className="nav-brand">
              <a href="/">Auth Demo</a>
            </div>
            <div className="nav-links">
              <a href="/login">Login</a>
              <a href="/register">Register</a>
            </div>
          </nav>
          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
