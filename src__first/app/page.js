import Image from "next/image";
import Header from "@/components/Header";
import Blog from "@/components/Blog";
import AllBlog from "@/components/AllBlog";
import Footer from "@/components/Footer";
import Toolbar from "@/components/Footer";
export default function Home() {
  return (
    <div>
      <Toolbar />
<Header />
<Blog />
<AllBlog />
<Footer />
    </div>
  );
}
