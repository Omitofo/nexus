import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Nexus — Supply Chain Platform",
  description: "Intelligent supply chain orchestration",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}