// src/app/page.tsx - Homepage with Tailwind CSS
"use client";
import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { authAPI, authUtils } from "../lib/api";
import Link from "next/link";

interface LoginFormData {
  username: string;
  password: string;
}

export default function Home() {
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await authAPI.login(formData);
      if (result.success) {
        authUtils.setUser(result.data);
        router.push("/Dashboard");
      } else {
        setError(result.message || "Login failed");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Login failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-blue-500 text-white rounded-t-xl p-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Welcome to Auth Demo</h1>
          <p className="text-blue-100">Please sign in to your account</p>
        </div>

        <div className="bg-white rounded-b-xl shadow-lg p-8 -mt-2">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Login
          </h2>

          {error && <div className="alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full btn-primary ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center border-t pt-6">
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/Register"
                className="text-blue-500 hover:text-blue-600 font-semibold hover:underline"
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
