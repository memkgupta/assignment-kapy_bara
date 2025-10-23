import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center bg-gradient-hero pt-10"
    >
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                The modern blogging platform
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Share Your{" "}
              <span className="bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Stories
              </span>
              <br />
              With The World
            </h1>

            <p className="text-xl text-muted-foreground max-w-xl">
              Create, publish, and grow your audience with our powerful yet
              simple blogging platform. Built for writers who want to focus on
              what matters—their content.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button variant="default" size="lg" className="group">
                <Link href={"/home"}> Start Writing Free</Link>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-foreground">10K+</div>
                <div className="text-sm text-muted-foreground">
                  Active Writers
                </div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div>
                <div className="text-3xl font-bold text-foreground">50M+</div>
                <div className="text-sm text-muted-foreground">
                  Monthly Readers
                </div>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in-up hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden shadow-elegant">
              <Image
                width={500}
                height={500}
                src={"/download.jpg"}
                alt="Modern blogging platform interface"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-20"></div>
    </section>
  );
};

export default Hero;
