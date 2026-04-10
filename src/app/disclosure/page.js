import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Disclosure | Krymoz",
  description: "Read our disclosure regarding affiliate links, sponsorships, and advertising on Krymoz.",
};

export default function DisclosurePage() {
  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-6xl font-black mb-10 tracking-tight">Disclosure</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-muted-foreground font-medium">
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-foreground">Affiliate Disclosure</h2>
            <p>
              In compliance with the FTC guidelines, please assume that any links on <span className="text-foreground font-bold italic">Krymoz</span> are affiliate links from which we receive a small compensation from sales of certain items.
            </p>
            <p>
              This means if you click on a link and make a purchase, we may receive a commission. This does not result in any additional cost to you. We only recommend products and services that we genuinely believe in and that provide value to our readers.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-foreground">Advertising and Sponsorships</h2>
            <p>
              Krymoz may also accept forms of cash advertising, sponsorship, paid insertions, or other forms of compensation. The compensation received will never influence the content, topics, or posts made on this blog. 
            </p>
            <p>
              We are committed to providing honest opinions, findings, beliefs, or experiences on those topics or products. The views and opinions expressed on this blog are purely our own.
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
