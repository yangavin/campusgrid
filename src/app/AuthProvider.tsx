"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getAdditionalUserInfo, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, User } from "firebase/auth";
import { auth } from "./firebase";
import { useRouter } from "next/navigation";
import { UserData } from "./listings/models";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { checkAnalytics } from "./firebase";
import { logEvent } from "firebase/analytics";

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
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    } else {
      const newUser: UserData = {
        uid: user.uid,
        email: user.email!,
        name: user.displayName!
      };
      await setDoc(userDocRef, newUser);
      return newUser;
    }
  }
  return null;
};

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        setUser(await loadUserData(user));
        const analytics = await checkAnalytics
        if (analytics) logEvent(analytics!, "login");
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider)
      const additionalInfo = getAdditionalUserInfo(result)
      if (additionalInfo?.isNewUser) {
          const analytics = await checkAnalytics;
          if (analytics) logEvent(analytics, "sign_up");
          const userData = await loadUserData(result.user);
          setUser(userData);
          setLoading(false)
          router.replace("/listings")
      }
  }

  const value: AuthContextType = {
    user,
    loading,
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