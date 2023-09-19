import { useState, useEffect } from 'react';
import {

  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth } from '../firebase/FirebaseConfig'

interface UserData {
  accessToken: string;
  uid: string;
  userName: string;
  userType: string;
  userPhone: string;
}

function useAuth() {
  const [user, setUser] = useState<UserData>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser: any) => {
      if (authUser) {
        const db = getFirestore();
        const userDoc = doc(db, 'users', authUser.uid);
        const documentSnapshot = await getDoc(userDoc);
        if (documentSnapshot.exists()) {
          setUser({
            ...authUser,
            userType: documentSnapshot.data().type,
            userName: documentSnapshot.data().name,
            userPhone: documentSnapshot.data().phone,
          });
        } else {
          setUser(authUser);
        }
      } else {
        setUser(undefined);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  interface SignInData {
    email: string,
    password: string
  }

  const signin = async (data: SignInData) => {
    await signInWithEmailAndPassword(auth, data.email, data.password);
  };

  const signout = async () => {
    await signOut(auth);
  };

  interface SignUpData {
    name: string,
    email: string,
    password: string,
    userType: string,
    userPhone: string
  }

  const signup = async (data: SignUpData) => {
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const db = getFirestore();
  
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      name: data.name,
      type: data.userType,
      phone: data.userPhone
    });
  
    await signOut(auth);
  };

  return { user, loading, signin, signout, signup };
}

export default useAuth;
