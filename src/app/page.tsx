import CTA from "./_components/landing/CTA";
import Features from "./_components/landing/Features";
import Footer from "./_components/landing/Footer";
import Header from "./_components/landing/Header";
import Hero from "./_components/landing/Hero";

export default async function Page() {
  return (
    <>
      <div className="min-h-screen">
        <Header />
        <main>
          <Hero />
          <Features />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
}
