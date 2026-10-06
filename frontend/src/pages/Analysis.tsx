import React, {
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import { apiService } from "@/services/api";


const Analysis: React.FC = () => {

  const navigate = useNavigate();

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [result, setResult] =
    useState<any>(null);


  const user =
    apiService.getStoredUser();

  const userName =
    user?.name || "User";



  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    setResult(null);

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase();

    if (
      !allowedTypes.includes(file.type) &&
      extension !== "pdf" &&
      extension !== "docx" &&
      extension !== "doc"
    ) {
      setError(
        "Please select a PDF, DOC, or DOCX file."
      );

      setSelectedFile(null);

      return;
    }

    setSelectedFile(file);
  };


  const handleUpload = async () => {

    if (!selectedFile) {

      setError(
        "Please select a resume first."
      );

      return;
    }


    try {

      setLoading(true);

      setError("");

      const response =
        await apiService.uploadResume(
          selectedFile
        );


      setResult(response);

      console.log(
        "Analysis response:",
        response
      );


      /*
       * If backend returns an analysis ID,
       * automatically open detail page.
       */

      const analysisId =
        response?.id ||
        response?.analysis_id;


      if (analysisId) {

        navigate(
          `/analysis/${analysisId}`
        );

      }

    } catch (err: any) {

      console.error(
        "Resume upload failed:",
        err
      );


      const message =
        err?.response?.data?.detail ||
        "Resume analysis failed. Please try again.";

      setError(message);

    } finally {

      setLoading(false);

    }
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
            className="sidebar-link"
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
            className="sidebar-link active"
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



      </aside>


      {/* ================= MAIN ================= */}

      <main className="main-content">

        <header className="topbar">

          <div>

            <h1 className="page-title">
              Resume Analysis
            </h1>

            <p className="page-subtitle">
              Upload your resume and get AI-powered insights
            </p>

          </div>


          <div className="user-area">

            <div className="user-info">

              <div className="user-name">
                {userName}
              </div>

              <div className="user-email">
                {user?.email || "user@example.com"}
              </div>

            </div>


            <div className="user-avatar">
              {userName
                .charAt(0)
                .toUpperCase()}
            </div>

          </div>

        </header>


        <section className="page">

          {/* HEADER */}

          <div className="analysis-header">

            <button
              className="back-button"
              onClick={() =>
                navigate("/")
              }
            >
              ← Back to Dashboard
            </button>


            <div className="analysis-heading">

              <div className="analysis-title-icon">
                🤖
              </div>

              <div>

                <h2>
                  AI Resume Analyzer
                </h2>

                <p>
                  Improve your resume with intelligent recommendations.
                </p>

              </div>

            </div>

          </div>


          {/* UPLOAD CARD */}

          <div className="analysis-upload-card">

            <div className="upload-large-icon">
              📄
            </div>


            <h2>
              Upload Your Resume
            </h2>


            <p>
              Upload a PDF or DOCX resume
              to start your AI analysis.
            </p>


            <div
              className="drop-zone"
              onClick={() =>
                fileInputRef.current?.click()
              }
            >

              <div className="drop-icon">
                ☁️
              </div>

              <h3>
                {selectedFile
                  ? selectedFile.name
                  : "Choose your resume"}
              </h3>

              <p>
                Click to browse your files
              </p>

              <span>
                PDF • DOC • DOCX
              </span>

            </div>


            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              style={{
                display: "none",
              }}
            />


            {selectedFile && (

              <div className="selected-file">

                <span>
                  📎
                </span>

                <div>

                  <strong>
                    {selectedFile.name}
                  </strong>

                  <small>
                    {" "}
                    (
                    {(
                      selectedFile.size /
                      1024 /
                      1024
                    ).toFixed(2)}
                    {" "}MB)
                  </small>

                </div>

              </div>

            )}


            {error && (

              <div className="error-message">
                ⚠️ {error}
              </div>

            )}


            <button
              className="btn btn-primary upload-button"
              onClick={handleUpload}
              disabled={
                !selectedFile ||
                loading
              }
            >

              {loading
                ? "Analyzing Resume..."
                : "🚀 Analyze Resume"}

            </button>

          </div>


          {/* RESULT */}

          {result && (

            <div className="analysis-result">

              <div className="result-header">

                <div>

                  <h2>
                    Analysis Completed
                  </h2>

                  <p>
                    Your resume has been successfully analyzed.
                  </p>

                </div>

                <div className="result-success">
                  ✓
                </div>

              </div>


              <div className="result-grid">

                <div className="result-card">

                  <span>
                    Resume Score
                  </span>

                  <strong>
                    {result?.score ??
                      result?.resume_score ??
                      "N/A"}
                  </strong>

                </div>


                <div className="result-card">

                  <span>
                    Skills
                  </span>

                  <strong>
                    {result?.skills?.length ??
                      result?.skills_count ??
                      "N/A"}
                  </strong>

                </div>


                <div className="result-card">

                  <span>
                    Job Match
                  </span>

                  <strong>
                    {result?.match_score
                      ? `${result.match_score}%`
                      : "N/A"}
                  </strong>

                </div>

              </div>


              <details className="raw-result">

                <summary>
                  View Analysis Response
                </summary>

                <pre>
                  {JSON.stringify(
                    result,
                    null,
                    2
                  )}
                </pre>

              </details>

            </div>

          )}

        </section>

      </main>

    </div>
  );
};


export default Analysis;