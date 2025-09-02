// components/Register/index.tsx - Register with Tailwind CSS
"use client";
import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "../../lib/api";
import Link from "next/link";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

export default function Register() {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await authAPI.register(formData);
      if (result.success) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => router.push("/"), 2000);
      } else {
        setError(result.message || "Registration failed");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Registration failed";
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
          <h1 className="text-3xl font-bold mb-2">Create New Account</h1>
          <p className="text-blue-100">
            Join us and get access to your personal dashboard
          </p>
        </div>

        <div className="bg-white rounded-b-xl shadow-lg p-8 -mt-2">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Register
          </h2>

          {error && <div className="alert-error">{error}</div>}

          {success && <div className="alert-success">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username (min 3 characters)"
                value={formData.username}
                onChange={handleChange}
                required
                minLength={3}
                className="form-input"
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
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
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center border-t pt-6">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/"
                className="text-blue-500 hover:text-blue-600 font-semibold hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
