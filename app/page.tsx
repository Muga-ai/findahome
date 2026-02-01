import Link from "next/link";
import {
  Home,
  Search,
  Building2,
  BarChart3,
  ShieldCheck,
  Users,
  ExternalLink,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen text-gray-900 bg-white">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-5 bg-black/40 backdrop-blur-md text-white">

        <div className="flex items-center gap-2 font-bold text-xl">
          <Home className="w-6 h-6" />
          Find A Home
        </div>

        <div className="flex gap-4">

          <Link
            href="/login"
            className="px-4 py-2 rounded-lg hover:bg-white/10 transition"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-5 py-2 rounded-lg bg-primary text-white font-semibold hover:opacity-90 transition"
          >
            Get Started
          </Link>

        </div>

      </nav>


      {/* HERO */}
      <section className="relative h-screen w-full overflow-hidden">

        {/* Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>


        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 text-white">

          <h1 className="text-4xl md:text-6xl font-extrabold max-w-4xl leading-tight">

            Find Your Perfect Home.
            <br />
            Anywhere in the World.

          </h1>

          <p className="mt-6 text-lg text-gray-200 max-w-2xl">

            Verified homes, trusted agents,
            and real market intelligence — in one ecosystem.

          </p>


          {/* Search */}
          <div className="mt-10 w-full max-w-2xl flex bg-white rounded-xl overflow-hidden shadow-lg">

            <div className="flex items-center px-4 text-gray-400">
              <Search />
            </div>

            <input
              placeholder="City, country, address..."
              className="flex-1 py-4 px-2 outline-none text-gray-800"
            />

            <Link
              href="/login"
              className="bg-primary px-6 flex items-center text-white font-semibold hover:opacity-90 transition"
            >
              Search
            </Link>

          </div>


          {/* CTA */}
          <div className="mt-10 flex gap-4 flex-wrap justify-center">

            <Link
              href="/register"
              className="px-8 py-4 rounded-xl bg-primary font-semibold hover:opacity-90 transition"
            >
              Find A Home
            </Link>

            <Link
              href="/register"
              className="px-8 py-4 rounded-xl border border-white font-semibold hover:bg-white hover:text-gray-900 transition"
            >
              Sell Homes
            </Link>

          </div>

        </div>

      </section>


      {/* ECOSYSTEM */}
      <section className="py-24 px-6 bg-gray-50">

        <h2 className="text-3xl font-bold text-center text-primary mb-6">
          The Find A Home Real Estate OS
        </h2>

        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-16">

          One integrated ecosystem powering valuation, agents,
          transactions, listings, and last-mile property solutions.

        </p>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">


          <EcosystemCard
            title="Property Valuation"
            text="Instant AI-powered property pricing."
            link="https://valora.vercel.app"
          />

          <EcosystemCard
            title="AgentCRM"
            text="Lead & commission management for agents."
            link="https://agentcrm.vercel.app"
          />

          <EcosystemCard
            title="Housify"
            text="Property discovery & listings platform."
            link="https://housify-chi.vercel.app"
          />

          <EcosystemCard
            title="FundiPlus"
            text="Last-mile housing & renovation services."
            link="https://fundiplus.vercel.app"
          />

        </div>

      </section>


      {/* FEATURES */}
      <section className="py-24 px-6 bg-white">

        <h2 className="text-3xl font-bold text-center text-primary mb-16">
          Why Choose Find A Home
        </h2>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">


          <Feature
            icon={<Building2 />}
            title="Verified Listings"
            text="Every property is validated for quality and trust."
          />

          <Feature
            icon={<BarChart3 />}
            title="Market Insights"
            text="Live pricing trends and investment data."
          />

          <Feature
            icon={<ShieldCheck />}
            title="Secure Platform"
            text="Protected users and secure transactions."
          />

          <Feature
            icon={<Users />}
            title="Trusted Agents"
            text="Top-rated professionals worldwide."
          />

          <Feature
            icon={<Home />}
            title="Virtual Tours"
            text="Experience homes remotely in HD."
          />

          <Feature
            icon={<Search />}
            title="Smart Search"
            text="AI-powered discovery."
          />

        </div>

      </section>


      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-10 text-center text-sm">

        © {new Date().getFullYear()} Find A Home. Built for Generations.

      </footer>

    </main>
  );
}


/* FEATURE CARD */

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="p-6 rounded-2xl border shadow-sm hover:shadow-lg transition text-center">

      <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-secondary text-primary rounded-xl">

        {icon}

      </div>

      <h3 className="font-semibold text-lg mb-2 text-primary">
        {title}
      </h3>

      <p className="text-gray-600">
        {text}
      </p>

    </div>
  );
}


/* ECOSYSTEM CARD */

function EcosystemCard({
  title,
  text,
  link,
}: {
  title: string;
  text: string;
  link: string;
}) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group p-6 rounded-2xl border bg-white shadow-sm hover:shadow-xl transition block"
    >

      <div className="flex items-center justify-between mb-4">

        <h3 className="font-semibold text-lg text-primary">
          {title}
        </h3>

        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary" />

      </div>

      <p className="text-gray-600 mb-4">
        {text}
      </p>

      <span className="text-sm font-medium text-primary group-hover:underline">
        Open Platform →
      </span>

    </a>
  );
}
