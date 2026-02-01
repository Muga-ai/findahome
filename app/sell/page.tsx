import Link from "next/link";
import { Home, Upload, Users, ShieldCheck } from "lucide-react";

export default function SellPage() {
  return (
    <main className="min-h-screen bg-light text-dark">

      {/* HERO */}
      <section className="bg-primary text-white py-24 px-6 text-center">

        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Sell Your Property Faster
        </h1>

        <p className="max-w-2xl mx-auto text-lg opacity-90 mb-8">

          Reach verified buyers, trusted agents, and global investors —
          all from one powerful platform.

        </p>

        <Link
          href="/register"
          className="inline-block bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition"
        >
          Get Started Free
        </Link>

      </section>


      {/* HOW IT WORKS */}
      <section className="py-24 px-6 bg-white">

        <h2 className="text-3xl font-bold text-center text-primary mb-16">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">

          <Step
            icon={<Upload />}
            title="Upload Property"
            text="Add photos, videos, and virtual tours in minutes."
          />

          <Step
            icon={<Users />}
            title="Get Matched"
            text="Connect with serious buyers and agents."
          />

          <Step
            icon={<Home />}
            title="Close Faster"
            text="Track offers and close securely."
          />

        </div>

      </section>


      {/* BENEFITS */}
      <section className="py-24 px-6 bg-gray-50">

        <h2 className="text-3xl font-bold text-center text-primary mb-16">
          Why Sell With Us
        </h2>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">

          <Benefit
            title="Verified Buyers"
            text="We filter serious buyers only."
          />

          <Benefit
            title="Market Pricing"
            text="Get real-time valuation insights."
          />

          <Benefit
            title="Trusted Agents"
            text="Work with top professionals."
          />

          <Benefit
            title="Secure Platform"
            text="Protected transactions and data."
          />

        </div>

      </section>


      {/* CTA */}
      <section className="py-24 px-6 bg-primary text-white text-center">

        <h2 className="text-3xl font-bold mb-6">
          Ready to Sell?
        </h2>

        <p className="mb-8 opacity-90">
          Create your free account and list today.
        </p>

        <div className="flex justify-center gap-4">

          <Link
            href="/register"
            className="bg-white text-primary px-6 py-3 rounded-lg font-semibold"
          >
            Register
          </Link>

          <Link
            href="/login"
            className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition"
          >
            Login
          </Link>

        </div>

      </section>

    </main>
  );
}


/* COMPONENTS */

function Step({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="text-center p-6 rounded-xl border shadow-sm">

      <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-secondary text-primary rounded-lg">
        {icon}
      </div>

      <h3 className="font-semibold text-lg mb-2">
        {title}
      </h3>

      <p className="text-gray-600">
        {text}
      </p>

    </div>
  );
}


function Benefit({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-white shadow">

      <h3 className="font-semibold text-lg mb-2 text-primary">
        {title}
      </h3>

      <p className="text-gray-600">
        {text}
      </p>

    </div>
  );
}
