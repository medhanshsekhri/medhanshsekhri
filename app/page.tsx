import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import FocusRail from "@/components/FocusRail";
import WhyMe from "@/components/WhyMe";
import Certifications from "@/components/Certifications";
import Vision from "@/components/Vision";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <FocusRail />
        <WhyMe />
        <Certifications />
        <Vision />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
