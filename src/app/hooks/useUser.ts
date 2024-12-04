import useSWR from 'swr';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserData } from '../models';

const fetchUserData = async (uid: string) => {
  if (!uid) return null;
  const userDocRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    return userDoc.data() as UserData;
  }
  return null;
};

export function useUser(uid: string | undefined) {
  const { data, error, mutate } = useSWR(uid ? ['user', uid] : null, () =>
    uid ? fetchUserData(uid) : null
  );

  return {
    user: data,
    isLoading: !error && !data,
    error,
    mutate,
  };
}
