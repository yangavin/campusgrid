'use client';

import { useAuth } from '../listings/(auth)/AuthProvider';
import SignInButton from '../listings/(auth)/SignInButton';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { mutate } from 'swr';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function UnsubscribePage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [unsubscribed, setUnsubscribed] = useState(false);

  useEffect(() => {
    const handleUnsubscribe = async () => {
      if (!user?.uid || unsubscribed || !user.subscribed) return;
      setIsLoading(true);

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const newData = {
          subscribed: false,
        };

        await setDoc(userDocRef, newData, { merge: true });
        await mutate(['user', user.uid]);
        setUnsubscribed(true);
      } catch (error) {
        console.error('Error unsubscribing from notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    handleUnsubscribe();
  }, [user, unsubscribed]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        {!user ? (
          <>
            <Alert>
              <AlertTitle>Please sign in to unsubscribe</AlertTitle>
              <AlertDescription>
                Sign in with your Google account to unsubscribe from
                notifications.
              </AlertDescription>
            </Alert>
            <div className="flex justify-center">
              <SignInButton />
            </div>
          </>
        ) : isLoading ? (
          <Alert>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <AlertTitle>Processing...</AlertTitle>
            <AlertDescription>
              Please wait while we unsubscribe you from notifications.
            </AlertDescription>
          </Alert>
        ) : unsubscribed || !user.subscribed ? (
          <>
            <Alert>
              <AlertTitle>Successfully Unsubscribed</AlertTitle>
              <AlertDescription>
                You have been unsubscribed from all notifications. You can
                always resubscribe by visiting the listings page.
              </AlertDescription>
            </Alert>
            <div className="flex justify-center">
              <Link href="/listings">
                <Button>Return to Listings</Button>
              </Link>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
