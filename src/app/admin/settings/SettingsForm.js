"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { 
  Settings, 
  Globe, 
  Search, 
  Mail, 
  Share2, 
  ShieldCheck, 
  BarChart3, 
  Save, 
  Layout, 
  CheckCircle2, 
  LayoutDashboard,
  Copyright,
  Hexagon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsForm() {
  const [form, setForm] = useState({
    /* BRAND */
    siteName: "",
    logo: "",
    favicon: "",
    primaryColor: "#4f46e5",

    /* SEO */
    metaDesc: "",
    keywords: "",
    author: "",
    ogImage: "",

    /* CONTACT */
    email: "",
    phone: "",
    address: "",

    /* SOCIAL */
    facebook: "",
    twitter: "",
    instagram: "",
    youtube: "",
    linkedin: "",

    /* FOOTER */
    footerText: "",
    copyright: "",

    /* SYSTEM */
    postsPerPage: 10,
    maintenance: false,
    comments: true,

    /* ANALYTICS */
    googleAnalytics: "",
    facebookPixel: ""
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const snap = await getDoc(doc(db, "settings", "main"));
    if (snap.exists()) setForm(prev => ({ ...prev, ...snap.data() }));
  }

  function change(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  async function save(e) {
    if (e) e.preventDefault();
    setLoading(true);
    await setDoc(doc(db, "settings", "main"), form);
    setSaved(true);
    setLoading(false);
    setTimeout(() => setSaved(false), 3000);
  }

  const Input = ({ label, icon: Icon, ...props }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 px-1">
        {Icon && <Icon size={12} className="text-primary" />} {label}
      </label>
      <input
        {...props}
        className="w-full bg-accent/20 border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm"
      />
    </div>
  );

  const TextArea = ({ label, icon: Icon, ...props }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 px-1">
        {Icon && <Icon size={12} className="text-primary" />} {label}
      </label>
      <textarea
        {...props}
        className="w-full bg-accent/20 border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm resize-none min-h-[120px]"
      />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Settings className="text-primary" /> Configuration Hub
          </h1>
          <p className="text-muted-foreground font-medium text-sm">Tune your blog's core parameters and personality.</p>
        </div>

        <button
          onClick={save}
          disabled={loading}
          className="px-10 py-4 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3"
        >
          {loading ? "Syncing..." : <><Save size={18} /> Save Preferences</>}
        </button>
      </header>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* LEFT COL: CORE SETTINGS */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* BRANDING */}
          <section className="bg-white dark:bg-[#0b1220] p-10 rounded-[2.5rem] border dark:border-gray-800 shadow-sm space-y-8">
            <h2 className="text-xl font-black flex items-center gap-3 border-b dark:border-gray-800 pb-6 mb-8">
              <Globe className="text-primary" /> Identity & Brand
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Input label="Platform Name" name="siteName" value={form.siteName} onChange={change} placeholder="e.g. Krymoz" icon={LayoutDashboard} />
              <Input label="Primary Identity Color" name="primaryColor" type="color" value={form.primaryColor} onChange={change} icon={Hexagon} />
              <Input label="Logo Asset URL" name="logo" value={form.logo} onChange={change} placeholder="https://..." icon={Layout} />
              <Input label="Favicon URL" name="favicon" value={form.favicon} onChange={change} placeholder="https://..." icon={Globe} />
            </div>
          </section>

          {/* SEO */}
          <section className="bg-white dark:bg-[#0b1220] p-10 rounded-[2.5rem] border dark:border-gray-800 shadow-sm space-y-8">
            <h2 className="text-xl font-black flex items-center gap-3 border-b dark:border-gray-800 pb-6 mb-8">
              <Search className="text-primary" /> Authority Optimization
            </h2>
            <TextArea label="Global Meta Description" name="metaDesc" value={form.metaDesc} onChange={change} placeholder="Short summary for Google..." icon={Search} />
            <div className="grid md:grid-cols-2 gap-8">
              <Input label="SEO Keywords" name="keywords" value={form.keywords} onChange={change} placeholder="news, tech, ai" icon={Hash} />
              <Input label="Chief Editor / Author" name="author" value={form.author} onChange={change} icon={User} />
            </div>
          </section>

          {/* FOOTER */}
          <section className="bg-white dark:bg-[#0b1220] p-10 rounded-[2.5rem] border dark:border-gray-800 shadow-sm space-y-8">
            <h2 className="text-xl font-black flex items-center gap-3 border-b dark:border-gray-800 pb-6 mb-8">
              <Layout className="text-primary" /> Footer Ecosystem
            </h2>
            <TextArea label="Footer Narrative" name="footerText" value={form.footerText} onChange={change} icon={Layout} />
            <Input label="Copyright Statement" name="copyright" value={form.copyright} onChange={change} icon={Copyright} />
          </section>
        </div>

        {/* RIGHT COL: SIDEBAR SETTINGS */}
        <div className="lg:col-span-4 space-y-12">
          
          {/* SOCIAL */}
          <section className="bg-white dark:bg-[#0b1220] p-10 rounded-[2.5rem] border dark:border-gray-800 shadow-sm space-y-8">
            <h2 className="text-xl font-black flex items-center gap-3 border-b dark:border-gray-800 pb-6 mb-8">
              <Share2 className="text-primary" /> Social Presence
            </h2>
            <div className="space-y-6">
              <Input label="Twitter / X" name="twitter" value={form.twitter} onChange={change} />
              <Input label="Facebook" name="facebook" value={form.facebook} onChange={change} />
              <Input label="Instagram" name="instagram" value={form.instagram} onChange={change} />
              <Input label="LinkedIn" name="linkedin" value={form.linkedin} onChange={change} />
            </div>
          </section>

          {/* SYSTEM TUNING */}
          <section className="bg-primary p-10 rounded-[2.5rem] text-white shadow-xl shadow-primary/20 space-y-8 relative overflow-hidden">
            <h2 className="text-xl font-black flex items-center gap-3 border-b border-white/20 pb-6 mb-8 relative z-10">
              <BarChart3 /> Engine Settings
            </h2>
            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-80 px-1">Posts Per Catalog Page</label>
                <input
                  type="number"
                  name="postsPerPage"
                  value={form.postsPerPage}
                  onChange={change}
                  className="w-full bg-white/10 border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-white/20 transition-all font-bold text-sm text-white"
                />
              </div>

              <Toggle label="Enable Community Comments" name="comments" value={form.comments} onChange={change} />
              <Toggle label="Emergency Maintenance Mode" name="maintenance" value={form.maintenance} onChange={change} />
            </div>
            <Settings size={150} className="absolute -bottom-10 -right-10 opacity-10" />
          </section>
        </div>
      </div>

      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 z-50 ring-8 ring-emerald-500/20"
          >
            <CheckCircle2 /> All changes synchronized successfully
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Toggle({ label, name, value, onChange }) {
  return (
    <label className="flex items-center justify-between bg-white/10 p-4 rounded-2xl cursor-pointer hover:bg-white/20 transition-all border border-white/10">
      <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
      <div className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" name={name} checked={value} onChange={onChange} className="sr-only peer" />
        <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/40"></div>
      </div>
    </label>
  );
}