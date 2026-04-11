"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Cookie, ShieldCheck, Info } from "lucide-react";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
              <Cookie size={16} /> Data Transparency
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">Cookie Policy</h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Last Updated: April 2026. This policy explains how Krymoz uses cookies and similar technologies to enhance your reading experience.
            </p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <section className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <ShieldCheck size={24} className="text-primary" /> What are Cookies?
              </h2>
              <p>
                Cookies are small text files stored on your device that help our website remember your preferences, 
                identify your session, and provide analytic data to improve our performance. 
                At Krymoz, we prioritize your privacy and only use cookies necessary for site functionality 
                and essential analytics.
              </p>
            </section>

            <section className="space-y-6 mt-12">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Info size={24} className="text-primary" /> How We Use Them
              </h2>
              <ul className="list-disc pl-6 space-y-4">
                <li><strong>Essential Cookies:</strong> Required for you to log in to the admin panel and manage your session safely.</li>
                <li><strong>Preference Cookies:</strong> Remember your theme (Dark/Light) and viewing preferences.</li>
                <li><strong>Analytics Cookies:</strong> Help us understand which articles are trending so we can produce more high-value content.</li>
                <li><strong>Marketing:</strong> We use minimal cookies for AdSense integration to ensure the ads shown are relevant to your technical interests.</li>
              </ul>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
