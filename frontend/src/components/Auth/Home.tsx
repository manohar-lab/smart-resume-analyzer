import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/services/api";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const [user, setUser] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      if (!apiService.isAuthenticated()) {
        navigate("/login");
        return;
      }

      const currentUser =
        await apiService.getCurrentUser();

      setUser(currentUser);

    } catch (error) {
      console.error(
        "Authentication error:",
        error
      );

      navigate("/login");

    } finally {
      setLoading(false);
    }
  };


  const handleLogout = async () => {
    await apiService.logout();

    navigate("/login");
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">
          Loading...
        </p>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-100">

      <header className="bg-white shadow">

        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <h1 className="text-2xl font-bold">
            EviMatch
          </h1>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>

      </header>


      <main className="max-w-7xl mx-auto px-6 py-10">

        <div className="bg-white rounded-xl shadow p-8">

          <h2 className="text-3xl font-bold mb-3">
            Welcome{user?.name
              ? `, ${user.name}`
              : ""}
            !
          </h2>

          <p className="text-gray-600">
            Email: {user?.email}
          </p>

        </div>


        <div className="grid md:grid-cols-3 gap-6 mt-8">

          <div className="bg-white p-6 rounded-xl shadow">

            <h3 className="text-xl font-bold mb-2">
              Resume Analysis
            </h3>

            <p className="text-gray-600">
              Upload and analyze your resume.
            </p>

          </div>


          <div className="bg-white p-6 rounded-xl shadow">

            <h3 className="text-xl font-bold mb-2">
              Skills
            </h3>

            <p className="text-gray-600">
              Identify your technical and professional skills.
            </p>

          </div>


          <div className="bg-white p-6 rounded-xl shadow">

            <h3 className="text-xl font-bold mb-2">
              Job Matching
            </h3>

            <p className="text-gray-600">
              Match your resume with suitable jobs.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
};

export default Home;