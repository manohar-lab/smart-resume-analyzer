import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/services/api";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await apiService.register({
        name,
        email,
        password,
      });

      await apiService.getCurrentUser();

      navigate("/");

    } catch (err: any) {
      console.error(
        "Registration error:",
        err
      );

      setError(
        err.response?.data?.detail ||
        "Registration failed."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center mb-2">
          Create Account
        </h1>

        <p className="text-gray-500 text-center mb-8">
          EviMatch Resume Analyzer
        </p>

        {error && (
          <div className="mb-5 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form
          onSubmit={handleRegister}
          className="space-y-5"
        >

          <div>
            <label className="block mb-2 font-medium">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter your name"
              required
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>


          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              required
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>


          <div>
            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter password"
              required
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>


          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50"
          >
            {loading
              ? "Creating account..."
              : "Register"}
          </button>

        </form>


        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}

          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 font-semibold"
          >
            Login
          </button>
        </p>

      </div>

    </div>
  );
};

export default Register;