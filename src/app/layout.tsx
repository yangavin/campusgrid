'use client';

import { useIsWebview } from '@/hooks/use-webview';
import WebviewWarning from '@/app/(main)/WebviewWarning';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isWebview = useIsWebview();

  return (
    <html lang="en">
      <link rel="shortcut icon" href="icon.png" type="image/x-icon" />
      <body className={inter.className}>
        {isWebview ? <WebviewWarning /> : children}
      </body>
    </html>
  );
}
