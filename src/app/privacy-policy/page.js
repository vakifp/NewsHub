import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy | Krymoz",
  description: "Learn how Krymoz collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-6xl font-black mb-10 tracking-tight">Privacy Policy</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-muted-foreground font-medium">
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-foreground">1. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, such as when you subscribe to our newsletter, contact us via email, or interact with our site features. This may include your name, email address, and any other information you choose to provide.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-foreground">2. Use of Information</h2>
            <p>
              Krymoz uses the collected data to provide and maintain our service, notify you about changes to our blog, allow you to participate in interactive features, provide customer support, and gather analysis to improve the quality of our content.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-foreground">3. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to track the activity on our service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-foreground">4. Data Protection</h2>
            <p>
              Your data's security is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
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
