import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Esports Management UI',
  description: 'Comprehensive esports team management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gray-900 text-white">
          <nav className="bg-gray-800 border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold text-blue-400">Esports Manager</h1>
                </div>
                <div className="flex items-center space-x-4">
                  <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                  <Link href="/teams" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Teams</Link>
                  <Link href="/players" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Players</Link>
                  <Link href="/fixtures" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Fixtures</Link>
                  <Link href="/results" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Results</Link>
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}