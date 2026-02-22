"use client";

import { useEffect,useState } from "react";
import { db } from "@/lib/firebase";
import { collection,getDocs } from "firebase/firestore";



import CategoryForm from "./CategoryForm";

export default function Page(){

  const [cats,setCats]=useState([]);

  useEffect(()=>{load()},[]);

  async function load(){
    const snap=await getDocs(collection(db,"categories"));
    setCats(snap.docs.map(d=>({id:d.id,...d.data()})));
  }

  return(
    <div className="space-y-8">

      <h1 className="text-2xl font-bold">Categories</h1>

      <CategoryForm reload={load}/>


    </div>
  );
}