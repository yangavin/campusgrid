'use client';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  getAdditionalUserInfo,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  User,
} from 'firebase/auth';
import { auth } from '../../firebase';
import { UserData } from '../../models';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { checkAnalytics } from '../../firebase';
import { logEvent } from 'firebase/analytics';
import { useUser } from '@/app/hooks/useUser';

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  signIn: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const loadUserData = async (user: User | null): Promise<UserData | null> => {
  if (user) {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      await setDoc(
        userDocRef,
        {
          lastLoggedIn: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        },
        { merge: true }
      );
      return userDoc.data() as UserData;
    } else {
      const newUser: UserData = {
        uid: user.uid,
        email: user.email!,
        name: user.displayName!,
        lastLoggedIn: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };
      await setDoc(userDocRef, newUser);
      return newUser;
    }
  }
  return null;
};

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { user, mutate } = useUser(firebaseUser?.uid);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      setFirebaseUser(user);
      if (!user) {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (firebaseUser && user) {
      setLoading(false);
    }
  }, [firebaseUser, user]);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const additionalInfo = getAdditionalUserInfo(result);
    if (additionalInfo?.isNewUser) {
      const analytics = await checkAnalytics;
      if (analytics) logEvent(analytics, 'sign_up');
      await loadUserData(result.user);
      mutate();
    }
  };

  const value: AuthContextType = {
    user: user || null,
    loading: loading || (!user && !!firebaseUser),
    signIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
