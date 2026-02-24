"use client";

import { useEffect,useState } from "react";
import { db } from "@/lib/firebase";
import { doc,setDoc,getDoc } from "firebase/firestore";

export default function SettingsForm(){

  const [form,setForm]=useState({
    /* BRAND */
    siteName:"",
    logo:"",
    favicon:"",
    primaryColor:"#2563eb",

    /* SEO */
    metaDesc:"",
    keywords:"",
    author:"",
    ogImage:"",

    /* CONTACT */
    email:"",
    phone:"",
    address:"",

    /* SOCIAL */
    facebook:"",
    twitter:"",
    instagram:"",
    youtube:"",
    linkedin:"",

    /* FOOTER */
    footerText:"",
    copyright:"",

    /* SYSTEM */
    postsPerPage:5,
    maintenance:false,
    comments:true,

    /* ANALYTICS */
    googleAnalytics:"",
    facebookPixel:""
  });

  const [loading,setLoading]=useState(false);
  const [saved,setSaved]=useState(false);



  /* LOAD SETTINGS */
  useEffect(()=>{ load(); },[]);

  async function load(){
    const snap=await getDoc(doc(db,"settings","main"));
    if(snap.exists()) setForm(prev=>({...prev,...snap.data()}));
  }



  /* INPUT CHANGE */
  function change(e){
    const {name,value,type,checked}=e.target;
    setForm({...form,[name]:type==="checkbox"?checked:value});
  }



  /* SAVE */
  async function save(e){
    e.preventDefault();
    setLoading(true);

    await setDoc(doc(db,"settings","main"),form);

    setSaved(true);
    setLoading(false);
    setTimeout(()=>setSaved(false),2000);
  }



  /* INPUT STYLE */
  const input="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none";



  return(
    <form onSubmit={save} className="bg-white p-8 rounded-2xl shadow border space-y-10">

      <h2 className="text-2xl font-bold">Site Settings</h2>



      {/* ================= BRAND ================= */}
      <Section title="Branding">

        <input name="siteName" value={form.siteName} onChange={change} placeholder="Site Name" className={input}/>
        <input name="logo" value={form.logo} onChange={change} placeholder="Logo URL" className={input}/>
        <input name="favicon" value={form.favicon} onChange={change} placeholder="Favicon URL" className={input}/>

        <div>
          <label className="text-sm font-medium">Primary Color</label>
          <input type="color" name="primaryColor" value={form.primaryColor} onChange={change}/>
        </div>

      </Section>



      {/* ================= SEO ================= */}
      <Section title="SEO Settings">

        <textarea name="metaDesc" value={form.metaDesc} onChange={change}
          placeholder="Meta Description"
          className={input+"/> h-24"} />

        <input name="keywords" value={form.keywords} onChange={change} placeholder="Keywords (comma separated)" className={input}/>
        <input name="author" value={form.author} onChange={change} placeholder="Site Author" className={input}/>
        <input name="ogImage" value={form.ogImage} onChange={change} placeholder="Default OG Image URL" className={input}/>

      </Section>



      {/* ================= CONTACT ================= */}
      <Section title="Contact Info">

        <input name="email" value={form.email} onChange={change} placeholder="Email" className={input}/>
        <input name="phone" value={form.phone} onChange={change} placeholder="Phone" className={input}/>
        <input name="address" value={form.address} onChange={change} placeholder="Address" className={input}/>

      </Section>



      {/* ================= SOCIAL ================= */}
      <Section title="Social Links">

        <input name="facebook" value={form.facebook} onChange={change} placeholder="Facebook URL" className={input}/>
        <input name="twitter" value={form.twitter} onChange={change} placeholder="Twitter URL" className={input}/>
        <input name="instagram" value={form.instagram} onChange={change} placeholder="Instagram URL" className={input}/>
        <input name="youtube" value={form.youtube} onChange={change} placeholder="Youtube URL" className={input}/>
        <input name="linkedin" value={form.linkedin} onChange={change} placeholder="LinkedIn URL" className={input}/>

      </Section>



      {/* ================= FOOTER ================= */}
      <Section title="Footer Settings">

        <textarea name="footerText" value={form.footerText} onChange={change}
          placeholder="Footer description"
          className={input+" h-24"} />

        <input name="copyright" value={form.copyright} onChange={change}
          placeholder="Copyright text"
          className={input}/>

      </Section>



      {/* ================= SYSTEM ================= */}
      <Section title="System Settings">

        <input type="number" name="postsPerPage" value={form.postsPerPage} onChange={change} className={input}/>

        <Toggle name="maintenance" label="Maintenance Mode" value={form.maintenance} onChange={change}/>
        <Toggle name="comments" label="Enable Comments" value={form.comments} onChange={change}/>

      </Section>



      {/* ================= ANALYTICS ================= */}
      <Section title="Tracking Codes">

        <textarea name="googleAnalytics" value={form.googleAnalytics} onChange={change}
          placeholder="Google Analytics Script"
          className={input+" h-24"} />

        <textarea name="facebookPixel" value={form.facebookPixel} onChange={change}
          placeholder="Facebook Pixel Script"
          className={input+" h-24"} />

      </Section>



      {/* BUTTON */}
      <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold">
        {loading?"Saving...":"Save Settings"}
      </button>

      {saved && <p className="text-green-600 text-sm">Settings saved ✓</p>}

    </form>
  );
}



/* ================= UI HELPERS ================= */

function Section({title,children}){
  return(
    <div className="space-y-5">
      <h3 className="font-semibold text-lg border-b pb-2">{title}</h3>
      {children}
    </div>
  );
}

function Toggle({label,name,value,onChange}){
  return(
    <label className="flex items-center justify-between border p-3 rounded-xl cursor-pointer">
      <span className="text-sm">{label}</span>
      <input type="checkbox" name={name} checked={value} onChange={onChange}/>
    </label>
  );
}