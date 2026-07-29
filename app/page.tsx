import { AboutSection } from "@/components/home/AboutSection";
import { ContactSection } from "@/components/home/ContactSection";
import { Hero } from "@/components/home/Hero";
import { MenuPreview } from "@/components/home/MenuPreview";
import { SignatureDishes } from "@/components/home/SignatureDishes";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <AboutSection />
        <SignatureDishes />
        <MenuPreview />
        <ContactSection />
      </main>

      <Footer />
    </>
  );
}