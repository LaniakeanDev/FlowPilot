import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PlanningProvider } from "../context/PlanningContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlowPilot - CEVA FVL Planning Tool",
  description: "Optimize truck routes and car assignments for Finished Vehicle Logistics",
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-gray-50">
        <PlanningProvider>
          {children}
        </PlanningProvider>
      </body>
    </html>
  );
}
