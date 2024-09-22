"use client"
import React, { useEffect } from 'react';
import TaskManager from "@/app/TaskList/page";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if (!storedToken) {
      router.push("/Signin");
    } else {
      router.push("/TaskList"); 
    }
  }, [router]);

  // return (
  //   <div>
  //     <TaskManager />
  //   </div>
  // );
}

export default Home;
