import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, MapPin, Phone, Send, Sparkles, MessageSquare, ShieldCheck } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  title: "Contact Us | Krymoz Technical Support & Inquiries",
  description: "Reach out to the Krymoz editorial team for technical support, collaborations, or press inquiries.",
};

export default function ContactPage() {
  return (
    <div className="bg-background min-h-screen">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-32">
        <div className="flex justify-center mb-12">
          <Breadcrumbs />
        </div>

        <div className="grid lg:grid-cols-2 gap-20 items-start">
          
          <div className="space-y-12">
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                <Sparkles size={12} className="fill-primary" /> Transmission Center
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95]">
                Get in <span className="text-primary italic">Touch</span> with the Collective.
              </h1>
              <p className="text-muted-foreground text-lg font-medium max-w-md mx-auto lg:mx-0">
                Have a technical challenge or a story tip? Our editorial board is ready to analyze and respond.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: Mail, label: "Intelligence Hub", value: "support@krymoz.com" },
                { icon: MessageSquare, label: "Signal @krymoz_tech", value: "Available 24/7" },
                { icon: ShieldCheck, label: "Secure Channel", value: "Encrypted End-to-End" },
                { icon: MapPin, label: "Architecture", value: "Global Digital Network" },
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-3xl bg-accent/30 border border-border/50 space-y-3 group hover:bg-card transition-all duration-500">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">{item.label}</p>
                    <p className="font-bold text-sm text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card/40 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] border border-white/5 shadow-2xl relative group">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/20 transition-all duration-1000" />
            
            <form className="space-y-8">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest px-2 text-muted-foreground">Identity</label>
                    <input placeholder="Full Name" className="w-full bg-accent/20 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest px-2 text-muted-foreground">Digital Address</label>
                    <input placeholder="email@example.com" className="w-full bg-accent/20 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest px-2 text-muted-foreground">Mission Brief</label>
                  <textarea placeholder="Explicate your inquiry..." rows={5} className="w-full bg-accent/20 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none" />
                </div>
              </div>
              
              <button type="submit" className="w-full bg-primary text-white py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-4 group">
                Establish Connection
                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              
              <p className="text-[10px] text-center text-muted-foreground font-medium">
                By transmitting, you agree to our <span className="text-primary cursor-pointer hover:underline">Privacy Architecture</span>.
              </p>
            </form>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}

