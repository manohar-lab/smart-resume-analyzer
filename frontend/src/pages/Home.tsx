import React from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/services/api";

const Home: React.FC = () => {

  const navigate = useNavigate();

  const user =
    apiService.getStoredUser();

  const userName =
    user?.name || "User";

  const userEmail =
    user?.email ||
    "user@example.com";


  const handleLogout = async () => {

    await apiService.logout();

    navigate(
      "/login",
      { replace: true }
    );
  };


  return (

    <div className="app-layout">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <div className="sidebar-logo">

          <div className="logo-icon">
            E
          </div>

          <div>
            <div className="logo-text">
              EviMatch
            </div>

            <div className="logo-subtitle">
              Resume Analyzer
            </div>
          </div>

        </div>


        <div className="sidebar-section">

          <div className="sidebar-title">
            MAIN MENU
          </div>


          <button
            className="sidebar-link active"
            onClick={() =>
              navigate("/")
            }
          >
            <span className="sidebar-icon">
              🏠
            </span>

            Dashboard
          </button>


          <button
            className="sidebar-link"
            onClick={() =>
              navigate("/analysis")
            }
          >
            <span className="sidebar-icon">
              📄
            </span>

            Resume Analysis
          </button>


          <button
            className="sidebar-link"
            onClick={() =>
              navigate("/profile")
            }
          >
            <span className="sidebar-icon">
              👤
            </span>

            Profile
          </button>

        </div>


        <div className="sidebar-bottom">

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <span>
              🚪
            </span>

            Logout
          </button>

        </div>

      </aside>


      {/* ================= MAIN ================= */}

      <main className="main-content">

        {/* TOPBAR */}

        <header className="topbar">

          <div>

            <h1 className="page-title">
              Dashboard
            </h1>

            <p className="page-subtitle">
              Welcome back, {userName} 👋
            </p>

          </div>


          <div className="user-area">

            <div className="user-info">

              <div className="user-name">
                {userName}
              </div>

              <div className="user-email">
                {userEmail}
              </div>

            </div>


            <div className="user-avatar">
              {userName
                .charAt(0)
                .toUpperCase()}
            </div>

          </div>

        </header>


        {/* ================= PAGE ================= */}

        <section className="page">

          {/* HERO */}

          <div className="hero">

            <div className="hero-content">

              <div className="hero-badge">
                ✨ AI POWERED RESUME ANALYSIS
              </div>


              <h1>
                Build a Resume
                <br />

                <span>
                  That Gets You Hired.
                </span>
              </h1>


              <p>
                Upload your resume and get
                intelligent insights, skill
                analysis, job matching and
                personalized recommendations.
              </p>


              <div className="hero-actions">

                <button
                  className="btn btn-primary"
                  onClick={() =>
                    navigate("/analysis")
                  }
                >
                  📤 Upload Resume
                </button>


                <button
                  className="btn btn-secondary"
                  onClick={() =>
                    navigate("/analysis")
                  }
                >
                  📊 View Analysis
                </button>

              </div>

            </div>


            <div className="hero-visual">

              <div className="hero-circle">
                ✨
              </div>


              <div className="floating-card">

                <div className="floating-icon">
                  📄
                </div>

                <div>

                  <strong>
                    Resume Score
                  </strong>

                  <div className="mini-score">
                    82 / 100
                  </div>

                </div>

              </div>


              <div className="floating-card second">

                <div className="floating-icon">
                  🎯
                </div>

                <div>

                  <strong>
                    Job Match
                  </strong>

                  <div className="mini-score">
                    94%
                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* ================= STATS ================= */}

          <div className="stats-grid">

            <div className="stat-card">

              <div className="stat-top">

                <div>

                  <div className="stat-label">
                    Resumes Analyzed
                  </div>

                  <div className="stat-value">
                    12
                  </div>

                </div>

                <div className="stat-icon">
                  📄
                </div>

              </div>

              <div className="stat-change">
                ↑ 20% this month
              </div>

            </div>


            <div className="stat-card">

              <div className="stat-top">

                <div>

                  <div className="stat-label">
                    Average Score
                  </div>

                  <div className="stat-value">
                    82%
                  </div>

                </div>

                <div className="stat-icon">
                  ⭐
                </div>

              </div>

              <div className="stat-change">
                ↑ 8% improvement
              </div>

            </div>


            <div className="stat-card">

              <div className="stat-top">

                <div>

                  <div className="stat-label">
                    Skills Found
                  </div>

                  <div className="stat-value">
                    47
                  </div>

                </div>

                <div className="stat-icon">
                  💡
                </div>

              </div>

              <div className="stat-change">
                ↑ 6 new skills
              </div>

            </div>


            <div className="stat-card">

              <div className="stat-top">

                <div>

                  <div className="stat-label">
                    Job Matches
                  </div>

                  <div className="stat-value">
                    24
                  </div>

                </div>

                <div className="stat-icon">
                  🎯
                </div>

              </div>

              <div className="stat-change">
                ↑ 12 new matches
              </div>

            </div>

          </div>


          {/* ================= CONTENT ================= */}

          <div className="content-grid">

            {/* UPLOAD */}

            <div className="card">

              <div className="card-header">

                <div>

                  <div className="card-title">
                    Upload Resume
                  </div>

                  <div className="card-description">
                    Upload PDF or DOCX for AI analysis
                  </div>

                </div>

              </div>


              <div className="upload-box">

                <div className="upload-icon">
                  ☁️
                </div>

                <h3>
                  Upload your resume
                </h3>

                <p>
                  Supported formats: PDF, DOCX
                </p>


                <button
                  className="btn btn-primary"
                  onClick={() =>
                    navigate("/analysis")
                  }
                >
                  Choose Resume
                </button>

              </div>

            </div>


            {/* SCORE */}

            <div className="card score-card">

              <div className="card-title">
                Latest Resume Score
              </div>


              <div className="score-circle">

                <div className="score-number">
                  82
                </div>

                <div className="score-label">
                  out of 100
                </div>

              </div>


              <span className="badge badge-success">
                ✓ Good Resume
              </span>


              <p className="score-description">
                Your resume is performing
                well. Improve your skills
                section to increase your score.
              </p>

            </div>

          </div>


          {/* ================= RECENT ANALYSIS ================= */}

          <div className="card">

            <div className="card-header">

              <div>

                <div className="card-title">
                  Recent Analysis
                </div>

                <div className="card-description">
                  Your latest resume analysis results
                </div>

              </div>


              <button
                className="btn btn-secondary"
                onClick={() =>
                  navigate("/analysis")
                }
              >
                View All →
              </button>

            </div>


            <div className="table-container">

              <table className="data-table">

                <thead>

                  <tr>

                    <th>
                      Resume
                    </th>

                    <th>
                      Score
                    </th>

                    <th>
                      Skills
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Date
                    </th>

                  </tr>

                </thead>


                <tbody>

                  <tr>

                    <td>
                      📄 Software_Engineer.pdf
                    </td>

                    <td>
                      <strong>
                        82%
                      </strong>
                    </td>

                    <td>
                      18
                    </td>

                    <td>
                      <span className="badge badge-success">
                        Completed
                      </span>
                    </td>

                    <td>
                      Today
                    </td>

                  </tr>


                  <tr>

                    <td>
                      📄 Data_Scientist.pdf
                    </td>

                    <td>
                      <strong>
                        76%
                      </strong>
                    </td>

                    <td>
                      15
                    </td>

                    <td>
                      <span className="badge badge-success">
                        Completed
                      </span>
                    </td>

                    <td>
                      Yesterday
                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
};


export default Home;