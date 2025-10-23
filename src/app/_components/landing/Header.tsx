import { Button } from "@/components/ui/button";
import { PenLine } from "lucide-react";
import Link from "next/link";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <PenLine className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            BlogFlow
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#home"
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            Home
          </a>
          <a
            href="#features"
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            Features
          </a>

          <a
            href="#about"
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            About
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" className="hidden sm:inline-flex">
            Sign In
          </Button>
          <Button variant="default" asChild>
            <Link href={"/home"}>Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
