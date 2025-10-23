import { Card, CardContent } from "@/components/ui/card";
import { Zap, Users, BarChart3, Shield, Palette, Globe } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Optimized performance ensures your content loads instantly for every reader, anywhere in the world.",
  },
  {
    icon: Palette,
    title: "Beautiful Templates",
    description:
      "Choose from stunning, customizable templates designed to make your content shine.",
  },
  {
    icon: Users,
    title: "Audience Building",
    description:
      "Built-in tools to grow your subscriber base and engage with your community effortlessly.",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description:
      "Understand your audience with detailed insights and actionable data to grow your reach.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description:
      "Enterprise-grade security and 99.9% uptime guarantee to keep your blog always accessible.",
  },
  {
    icon: Globe,
    title: "SEO Optimized",
    description:
      "Rank higher on search engines with built-in SEO tools and automatic optimization.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-center">
            Everything You Need To{" "}
            <span className="bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Succeed
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features that help you create, publish, and grow your blog
            effortlessly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 animate-scale-in border-border/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-gradient-primary transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
