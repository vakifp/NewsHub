"use client";
import { createContext, useContext, useState } from "react";

const Store = createContext();

export function StoreProvider({ children }) {
  const [posts, setPosts] = useState([]);
  return (
    <Store.Provider value={{ posts, setPosts }}>
      {children}
    </Store.Provider>
  );
}

export const useStore = () => useContext(Store);