import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 text-dark">


      {/* LEFT BRAND PANEL */}
      <div className="hidden lg:flex flex-col justify-center px-16 bg-primary text-black">

        <h1 className="text-4xl font-bold mb-4">
          Find A Home
        </h1>

        <p className="text-lg opacity-90 max-w-md mb-6">
          Access verified properties, trusted agents, and real market insights —
          all in one global platform.
        </p>

        <p className="text-sm opacity-80">
          Built for generations.
        </p>

      </div>


      {/* RIGHT AUTH PANEL */}
      <div className="flex items-center justify-center px-6 bg-light">

        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">


          {/* Header */}
          <div className="mb-8 text-center">

            <h2 className="text-3xl font-bold text-primary mb-2">
              Welcome Back
            </h2>

            <p className="text-gray-600">
              Login to manage your properties
            </p>

          </div>


          <AuthForm mode="login" />


          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600">

            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-black font-medium hover:underline"
            >
              Register
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
