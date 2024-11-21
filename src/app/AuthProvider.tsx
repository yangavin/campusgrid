"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}
const loadUserData = async (user: User | null): Promise<UserData | null> => {
  if (!user) return null;
  try {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      // Save new user data if it’s the first sign-up
      await setDoc(userRef, { uid: user.uid, email: user.email, name: user.displayName });
    }
    return docSnap.data() as UserData;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
  }, [user]);

  const value: AuthContextType = {
    user,
    loading
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