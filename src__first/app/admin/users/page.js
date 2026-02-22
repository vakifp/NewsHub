"use client";

import { useEffect,useState } from "react";
import { db } from "@/lib/firebase";
import { collection,getDocs } from "firebase/firestore";

import UserForm from "./UserForm";
import UserTable from "./UserTable";

export default function UsersPage(){

  const [users,setUsers]=useState([]);

  useEffect(()=>{load()},[]);

  async function load(){
    const snap=await getDocs(collection(db,"users"));
    setUsers(snap.docs.map(d=>({id:d.id,...d.data()})));
  }

  return(
    <div className="space-y-8">

      <h1 className="text-2xl font-bold">Users</h1>

      <UserForm reload={load}/>

      <div className="bg-white rounded-2xl shadow border overflow-hidden">
        <UserTable users={users} reload={load}/>
      </div>

    </div>
  );
}