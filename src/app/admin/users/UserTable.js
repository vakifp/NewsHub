"use client";

import { db } from "@/lib/firebase";
import { deleteDoc,doc,updateDoc } from "firebase/firestore";
import RoleBadge from "./RoleBadge";

export default function UserTable({users,reload}){

  async function remove(id){
    if(confirm("Delete user?")){
      await deleteDoc(doc(db,"users",id));
      reload();
    }
  }

  async function changeRole(id,role){
    await updateDoc(doc(db,"users",id),{role});
    reload();
  }

  return(
    <table className="w-full text-sm">

      <thead className="bg-gray-50 text-gray-600">
        <tr>
          <th className="p-4 text-left">Name</th>
          <th className="p-4 text-left">Email</th>
          <th className="p-4 text-left">Role</th>
          <th className="p-4 text-center">Actions</th>
        </tr>
      </thead>

      <tbody>
        {users.map(user=>(
          <tr key={user.id} className="border-t">

            <td className="p-4">{user.name}</td>
            <td className="p-4">{user.email}</td>

            <td className="p-4">
              <select
                value={user.role}
                onChange={e=>changeRole(user.id,e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option>Admin</option>
                <option>Editor</option>
                <option>Writer</option>
              </select>
            </td>

            <td className="p-4 text-center">
              <button
                onClick={()=>remove(user.id)}
                className="px-3 py-1 bg-red-500 text-white rounded text-xs"
              >
                Delete
              </button>
            </td>

          </tr>
        ))}
      </tbody>

    </table>
  );
}