import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 text-dark">


      {/* LEFT BRAND PANEL */}
      <div className="hidden lg:flex flex-col justify-center px-16 bg-primary text-black">

        <h1 className="text-4xl font-bold mb-4">
          Join Find A Home
        </h1>

        <p className="text-lg opacity-90 max-w-md mb-6">
          Create your free account and start buying, selling, and managing
          property globally.
        </p>

        <ul className="space-y-2 text-sm opacity-90">
          <li>✔ Verified Listings</li>
          <li>✔ Virtual Tours</li>
          <li>✔ Market Intelligence</li>
          <li>✔ Trusted Agents</li>
        </ul>

      </div>


      {/* RIGHT AUTH PANEL */}
      <div className="flex items-center justify-center px-6 bg-light">

        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">


          {/* Header */}
          <div className="mb-8 text-center">

            <h2 className="text-3xl font-bold text-primary mb-2">
              Create Account
            </h2>

            <p className="text-gray-600">
              Start your journey today
            </p>

          </div>


          <AuthForm mode="register" />


          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600">

            Already have an account?{" "}
            <Link
              href="/login"
              className="text-black font-medium hover:underline"
            >
              Login
            </Link>

          </div>

          <div className="mt-4 text-center text-sm">

            <Link
              href="/"
              className="text-gray-500 hover:underline"
            >
              ← Back to Home
            </Link>

          </div>

        </div>

      </div>

    </main>
  );
}
