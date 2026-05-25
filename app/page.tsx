import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import BentoProjects from "@/components/BentoProjects";
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
        <BentoProjects />
        <WhyMe />
        <Certifications />
        <Vision />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
