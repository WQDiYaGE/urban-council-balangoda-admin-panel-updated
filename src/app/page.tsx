"use client"

import {useEffect} from 'react';
import {collection, getDocs} from 'firebase/firestore';
import {db} from '@/lib/firebase';
import {Admin} from '@/types';
import {Login} from "@/components/auth/Login";

export default function Home() {
  const fetchAdminData = async () => {
    try {
      const adminCollection = collection(db, 'admin');
      const adminSnapshot = await getDocs(adminCollection);
      return adminSnapshot.docs.map(doc => doc.data() as Admin)
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAdminData();
      console.log(data);
    };

    // fetchData();
  }, []);


  return (
    <main className="">
      <Login/>

    </main>
  );
}
