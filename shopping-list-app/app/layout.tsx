import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';
import { PrimeReactProvider } from 'primereact/api';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Shopping List',
  description: 'What I need to buy?',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PrimeReactProvider>
      <html lang="en">
        <head><link id="app-theme" rel="stylesheet" href="/themes/lara-dark-blue/theme.css" /></head>
        <body className={inter.className}>{children}</body>
      </html>
    </PrimeReactProvider>
  )
}
