"use client"
import React, { useEffect } from 'react';
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if (!storedToken) {
      router.push("/signin");
    } else {
      router.push("/tasklist"); 
    }
  }, [router]);
}

export default Home;
