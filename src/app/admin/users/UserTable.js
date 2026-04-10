"use client";

import { db } from "@/lib/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { User, Mail, Shield, Trash2, ChevronDown } from "lucide-react";

export default function UserTable({ users, reload }) {
  async function remove(id) {
    if (confirm("Permanently remove this access profile?")) {
      await deleteDoc(doc(db, "users", id));
      reload();
    }
  }

  async function changeRole(id, role) {
    await updateDoc(doc(db, "users", id), { role });
    reload();
  }

  return (
    <div className="bg-white dark:bg-[#0b1220] rounded-[2rem] border dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="p-8 border-b dark:border-gray-800 bg-accent/10">
        <h3 className="text-xl font-black tracking-tight">Active Operatives</h3>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Total Users: {users.length}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b dark:border-gray-800 bg-accent/5">
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Identity</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Security Email</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Permission Set</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Control</th>
            </tr>
          </thead>

          <tbody className="divide-y dark:divide-gray-800 font-medium">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-20 text-center text-muted-foreground font-bold italic">
                  No registered users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-accent/30 transition-all group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black">
                        {user.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <span className="font-bold text-sm tracking-tight">{user.name}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-muted-foreground overflow-hidden">
                      <Mail size={14} className="flex-shrink-0" />
                      <span className="truncate text-sm">{user.email}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="relative inline-block w-full max-w-[140px]">
                      <select
                        value={user.role}
                        onChange={(e) => changeRole(user.id, e.target.value)}
                        className="w-full bg-accent/20 border-none rounded-xl px-4 py-2 text-xs font-bold appearance-none outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer pr-8"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Editor">Editor</option>
                        <option value="Writer">Writer</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <button
                      onClick={() => remove(user.id)}
                      className="p-2.5 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all shadow-sm"
                      title="Revoke Access"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}