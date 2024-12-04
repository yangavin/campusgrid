'use client';

import { useAuth } from './AuthProvider';

export default function SignInButton({
  onSignInSuccess,
}: {
  onSignInSuccess?: () => void;
}) {
  const { signIn } = useAuth();

  const handleSignIn = async () => {
    try {
      await signIn();
      onSignInSuccess?.();
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  return (
    <button
      onClick={handleSignIn}
      className="flex items-center justify-center gap-3 rounded-lg border bg-white px-4 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
    >
      <img src="/google.svg" alt="Google" />
      Sign in with Google
    </button>
  );
}
