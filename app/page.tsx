import {
  Home,
  Search,
  Building2,
  BarChart3,
  ShieldCheck,
  Users,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen text-dark bg-light">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-5 bg-black/40 backdrop-blur-md text-white">

        <div className="flex items-center gap-2 font-bold text-xl">
          <Home className="w-6 h-6" />
          Find A Home
        </div>

        <div className="flex gap-4">

          <button className="px-4 py-2 rounded-lg hover:bg-white/10 transition">
            Login
          </button>

          <button className="px-5 py-2 rounded-lg bg-accent text-white font-semibold hover:opacity-90 transition">
            Get Started
          </button>

        </div>

      </nav>


      {/* HERO VIDEO */}
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
            and real market intelligence — in one platform.

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

            <button className="bg-primary px-6 text-white font-semibold hover:opacity-90 transition">
              Search
            </button>

          </div>


          {/* CTA */}
          <div className="mt-10 flex gap-4 flex-wrap justify-center">

            <button className="px-8 py-4 rounded-xl bg-primary font-semibold hover:opacity-90 transition">
              Find A Home
            </button>

            <button className="px-8 py-4 rounded-xl border border-white font-semibold hover:bg-white hover:text-dark transition">
              Sell Homes
            </button>

          </div>

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
            text="AI-powered property discovery."
          />

        </div>

      </section>


      {/* FOOTER */}
      <footer className="bg-dark text-gray-400 py-10 text-center text-sm">

        © {new Date().getFullYear()} Find A Home. Built for Generations.

      </footer>

    </main>
  );
}


/* Feature Card */

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
