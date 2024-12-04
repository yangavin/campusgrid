import { AuthProvider } from '../listings/(auth)/AuthProvider';

export default function UnsubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
