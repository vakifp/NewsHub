"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import CategoryManager from "./CategoryForm";
import { motion } from "framer-motion";

export default function CategoriesPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We just need to trigger the initial load or ensure subcomponent handles it
    setLoading(false);
  }, []);

  if (loading) return <div className="p-20 text-center animate-pulse">Synchronizing taxonomy...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      <CategoryManager />
    </motion.div>
  );
}