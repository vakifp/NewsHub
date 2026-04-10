import Header from "@/components/Header";
import Blog from "@/components/Blog";
import AllBlog from "@/components/AllBlog";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Blog />
        <AllBlog />
      </main>
      <Footer />
    </div>
  );
}
