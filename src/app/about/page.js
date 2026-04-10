import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About Us | Krymoz",
  description: "Learn more about Krymoz, our mission, and our commitment to delivering high-quality news and insights.",
};

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-6xl font-black mb-10 tracking-tight">About Krymoz</h1>
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-6 text-muted-foreground font-medium">
          <p>
            Welcome to <span className="text-foreground font-bold italic">Krymoz</span>, your primary source for the latest in technology, artificial intelligence, and digital lifestyle insights.
          </p>
          <p>
            Founded by a team of passionate tech enthusiasts, our mission is to demystify the complex world of modern technology and provide our readers with actionable intelligence, deep dives into AI trends, and comprehensive guides for Windows users and beyond.
          </p>
          <h2 className="text-2xl font-black text-foreground pt-6">Our Vision</h2>
          <p>
            We believe that knowledge should be accessible, high-impact, and beautifully presented. In an age of information overload, Krymoz stands as a beacon of curated, editorial-grade content that respects your time and fuels your curiosity.
          </p>
          <h2 className="text-2xl font-black text-foreground pt-6">What We Cover</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><span className="text-foreground font-bold">Artificial Intelligence:</span> From LLMs to autonomous systems.</li>
            <li><span className="text-foreground font-bold">Tech Insights:</span> Breaking news and analysis on industry giants.</li>
            <li><span className="text-foreground font-bold">Windows & Software:</span> Troubleshooting, optimization, and expert tips.</li>
            <li><span className="text-foreground font-bold">Digital Strategy:</span> Navigating the modern web with confidence.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
