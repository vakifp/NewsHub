import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms of Service | Krymoz",
  description: "Read the terms and conditions for using the Krymoz platform.",
};

export default function TermsPage() {
  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-6xl font-black mb-10 tracking-tight">Terms of Service</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-muted-foreground font-medium">
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Krymoz, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-foreground">2. Intellectual Property</h2>
            <p>
              The blog and its original content, features, and functionality are owned by Krymoz and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-foreground">3. User Conduct</h2>
            <p>
              You agree to use Krymoz only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the platform. Prohibited behavior includes harassing or causing distress or inconvenience to any other user.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-foreground">4. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of your jurisdiction, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>
          </section>

          <section className="space-y-4 border-t pt-10">
            <p className="text-xs italic">Last updated: April 10, 2026</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
