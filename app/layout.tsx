import './globals.css'
import { Inter } from 'next/font/google'
import HeaderBar from './components/headerBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'App',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <HeaderBar/>
        <div id="child">
        {children}
        </div>
      </body>
    </html>
  )
}
