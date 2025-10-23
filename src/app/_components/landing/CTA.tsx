import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const benefits = [
  "No credit card required",
  "14-day free trial",
  "Cancel anytime",
  "24/7 support included",
];

const CTA = () => {
  return (
    <section className="py-24 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="relative overflow-hidden border-0 shadow-elegant">
            <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
            <CardContent className="relative p-12 text-center space-y-8">
              <div className="space-y-4 animate-fade-in">
                <h2 className="text-4xl md:text-5xl font-bold">
                  Ready To Start Your{" "}
                  <span className="bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Writing Journey?
                  </span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of writers who've already discovered the
                  easiest way to share their stories.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 animate-scale-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <Button variant="default" size="lg" className="group">
                  <Link href={"/home"}>Get Started Free</Link>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Trusted by 10,000+ writers worldwide
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CTA;
