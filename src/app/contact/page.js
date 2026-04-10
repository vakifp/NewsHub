import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, MapPin, Phone, Send } from "lucide-react";

export const metadata = {
  title: "Contact Us | Krymoz",
  description: "Get in touch with the Krymoz team for inquiries, collaboration, or support.",
};

export default function ContactPage() {
  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-6xl font-black mb-10 tracking-tight text-center">Get in Touch</h1>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="p-8 rounded-[2rem] bg-accent/30 border border-border/50 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Mail size={24} />
            </div>
            <p className="font-black text-xs uppercase tracking-widest text-muted-foreground">Support</p>
            <p className="font-bold text-sm">support@krymoz.com</p>
          </div>
          
          <div className="p-8 rounded-[2rem] bg-accent/30 border border-border/50 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <MapPin size={24} />
            </div>
            <p className="font-black text-xs uppercase tracking-widest text-muted-foreground">Location</p>
            <p className="font-bold text-sm">Global Headquarters</p>
          </div>

          <div className="p-8 rounded-[2rem] bg-accent/30 border border-border/50 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Phone size={24} />
            </div>
            <p className="font-black text-xs uppercase tracking-widest text-muted-foreground">Social</p>
            <p className="font-bold text-sm">@krymoz_tech</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest px-2">Your Name</label>
                <input placeholder="Full Name" className="w-full bg-accent/20 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest px-2">Email Address</label>
                <input placeholder="email@example.com" className="w-full bg-accent/20 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest px-2">Message</label>
              <textarea placeholder="How can we help?" rows={6} className="w-full bg-accent/20 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none" />
            </div>
            <button type="button" className="w-full bg-primary text-white py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3">
              <Send size={20} /> Transmit Message
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
