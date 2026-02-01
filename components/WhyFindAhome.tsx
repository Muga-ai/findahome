import {
  TrendingUp,
  Home,
  Briefcase,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    title: "Valora AI",
    subtitle: "Smart Property Valuation",
    description:
      "AI-powered pricing insights to help you buy, sell, and invest with confidence.",
    icon: TrendingUp,
  },
  {
    title: "Housify",
    subtitle: "Smart Property Discovery",
    description:
      "Discover verified homes with advanced filters, location data, and virtual tours.",
    icon: Home,
  },
  {
    title: "AgentCRM",
    subtitle: "Agent Productivity Suite",
    description:
      "A powerful CRM built for real estate professionals to manage leads and close faster.",
    icon: Briefcase,
  },
  {
    title: "Find A Home",
    subtitle: "Trusted Marketplace",
    description:
      "A secure, verified platform connecting buyers, sellers, renters, and agents.",
    icon: ShieldCheck,
  },
];

export default function WhyFindAhome() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Find A Home?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            A complete real estate ecosystem — from valuation to closing.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-8 text-center"
            >
              <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center rounded-xl bg-primary/10">
                <item.icon className="w-7 h-7 text-primary" />
              </div>

              <h3 className="text-xl font-semibold mb-1">
                {item.title}
              </h3>

              <p className="text-sm text-primary mb-3">
                {item.subtitle}
              </p>

              <p className="text-gray-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
