'use client';

import { AuthProvider } from '../(main)/AuthProvider';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AuthProvider>{children}</AuthProvider>;
}
