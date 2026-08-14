import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/services/api";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await apiService.login({
        email,
        password,
      });

      await apiService.getCurrentUser();

      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">

      {/* LEFT SIDE */}

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 p-16 items-center">

        <div className="absolute w-96 h-96 bg-white/10 rounded-full -top-20 -left-20 blur-3xl" />

        <div className="relative max-w-xl text-white">

          <div className="flex items-center gap-3 mb-10">

            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-xl font-bold">
              E
            </div>

            <span className="text-2xl font-bold">
              EviMatch
            </span>

          </div>

          <h1 className="text-5xl font-bold leading-tight">
            Your resume.
            <br />
            Your career.
            <br />
            <span className="text-blue-200">
              Powered by AI.
            </span>
          </h1>

          <p className="text-blue-100 text-lg mt-6 leading-relaxed">
            Analyze your resume, discover your strengths,
            improve your ATS score, and find opportunities
            that match your skills.
          </p>

        </div>

      </div>


      {/* RIGHT SIDE */}

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">

        <div className="w-full max-w-md">

          <div className="lg:hidden text-center mb-10">

            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-xl">
              E
            </div>

            <h1 className="text-white text-2xl font-bold mt-3">
              EviMatch
            </h1>

          </div>


          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">

            <h2 className="text-3xl font-bold text-white">
              Welcome back
            </h2>

            <p className="text-slate-400 mt-2 mb-8">
              Sign in to continue to your dashboard.
            </p>


            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 mb-5 text-sm">
                {error}
              </div>
            )}


            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              <div>

                <label className="text-sm text-slate-300 block mb-2">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="you@example.com"
                  required
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500"
                />

              </div>


              <div>

                <label className="text-sm text-slate-300 block mb-2">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  required
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500"
                />

              </div>


              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-xl transition disabled:opacity-50"
              >
                {loading
                  ? "Signing in..."
                  : "Sign In"}
              </button>

            </form>


            <div className="text-center mt-7">

              <p className="text-slate-400 text-sm">
                Don't have an account?
              </p>

              <button
                onClick={() =>
                  navigate("/register")
                }
                className="text-blue-400 hover:text-blue-300 font-semibold mt-1"
              >
                Create an account
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;