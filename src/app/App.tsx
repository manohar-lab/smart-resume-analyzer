import React, { useState } from "react";
import "../styles/globals.css";

type EvidenceStatus =
  | "VERIFIED"
  |  "SUPPORTED"
  | "CLAIMED"
  | "UNCERTAIN"
  | "UNSUPPORTED";

interface Skill {
  name: string;
  status: EvidenceStatus;
  evidence: string;
  confidence: number;
}

const skills: Skill[] = [
  {
    name: "React",
    status: "VERIFIED",
    evidence: "Reusable components and responsive interfaces",
    confidence: 94,
  },
  {
    name: "TypeScript",
    status: "SUPPORTED",
    evidence: "Typed frontend components and application logic",
    confidence: 87,
  },
  {
    name: "Python",
    status: "CLAIMED",
    evidence: "Listed in candidate skills",
    confidence: 68,
  },
  {
    name: "Flask",
    status: "UNCERTAIN",
    evidence: "Mentioned without strong project evidence",
    confidence: 54,
  },
  {
    name: "Docker",
    status: "UNSUPPORTED",
    evidence: "No supporting evidence found",
    confidence: 18,
  },
];

function App() {
  const [page, setPage] = useState<"login" | "dashboard">("login");

  return page === "login" ? (
    <LoginPage onLogin={() => setPage("dashboard")} />
  ) : (
    <Dashboard onLogout={() => setPage("login")} />
  );
}

/* ================= LOGIN ================= */

function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    onLogin();
  };

  return (
    <div className="login-page">
      <div className="login-glow glow-1" />
      <div className="login-glow glow-2" />

      <div className="login-container">
        <div className="login-left">
          <div className="logo">
            <div className="logo-symbol">E</div>

            <div>
              <strong>EviMatch</strong>
              <small>AI TALENT INTELLIGENCE</small>
            </div>
          </div>

          <div className="login-message">
            <div className="pill">
              <span className="pulse" />
              AI-POWERED TALENT ANALYSIS
            </div>

            <h1>
              Hire with
              <br />
              <span>evidence.</span>
            </h1>

            <p>
              EviMatch transforms resumes into clear,
              evidence-backed candidate insights so you
              can make smarter hiring decisions.
            </p>

            <div className="mini-stats">
              <div>
                <strong>94%</strong>
                <span>Evidence accuracy</span>
              </div>

              <div>
                <strong>5x</strong>
                <span>Faster screening</span>
              </div>

              <div>
                <strong>100%</strong>
                <span>Traceable results</span>
              </div>
            </div>
          </div>

          <div className="login-bottom-text">
            © 2026 EviMatch
          </div>
        </div>

        <div className="login-right">
          <div className="login-card">
            <div className="card-top-line" />

            <div className="welcome">
              <span className="welcome-badge">✦</span>

              <div>
                <small>WELCOME BACK</small>
                <h2>Sign in to EviMatch</h2>
              </div>
            </div>

            <p className="login-description">
              Continue to your intelligent candidate
              analysis workspace.
            </p>

            <form onSubmit={submit}>
              <label>Email address</label>

              <div className="modern-input">
                <span>✉</span>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />
              </div>

              <div className="password-heading">
                <label>Password</label>

                <button
                  type="button"
                  onClick={() =>
                    alert("Password recovery coming soon.")
                  }
                >
                  Forgot?
                </button>
              </div>

              <div className="modern-input">
                <span>◆</span>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />
              </div>

              <label className="remember">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>

              <button
                className="primary-login"
                type="submit"
              >
                <span>Sign in to workspace</span>
                <b>→</b>
              </button>
            </form>

            <div className="or">
              <span>OR</span>
            </div>

            <button
              className="demo-login"
              type="button"
              onClick={() => {
                setEmail("demo@evimatch.ai");
                setPassword("demo123");
              }}
            >
              <span>✦</span>
              Continue with demo account
            </button>

            <p className="signup">
              Don't have an account?
              <button
                type="button"
                onClick={() =>
                  alert("Registration will be added next.")
                }
              >
                Create account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= DASHBOARD ================= */

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [resume, setResume] = useState<File | null>(null);
  const [job, setJob] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const analyze = () => {
    if (!resume || !job.trim()) {
      alert("Please upload a resume and enter a job description.");
      return;
    }

    setLoading(true);
    setAnalyzed(false);

    setTimeout(() => {
      setLoading(false);
      setAnalyzed(true);
    }, 1600);
  };

  return (
    <div className="dashboard">
      <aside className="sidebar-new">
        <div className="sidebar-logo">
          <div className="logo-symbol">E</div>

          <div>
            <strong>EviMatch</strong>
            <small>AI TALENT INTELLIGENCE</small>
          </div>
        </div>

        <nav>
          <button className="nav-active">
            <span>▦</span>
            Overview
          </button>

          <button>
            <span>◎</span>
            Candidates
          </button>

          <button>
            <span>⌁</span>
            Job matches
          </button>

          <button>
            <span>◫</span>
            Reports
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-box">
            <div>✦</div>
            <strong>AI Insights</strong>
            <span>
              Evidence-aware analysis for better
              decisions.
            </span>
          </div>

          <button
            className="sidebar-logout"
            onClick={onLogout}
          >
            ⇥
            Sign out
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <span className="header-label">
              WORKSPACE / ANALYSIS
            </span>
            <h1>Candidate Intelligence</h1>
          </div>

          <div className="profile">
            <div className="notification">♢</div>

            <div className="profile-avatar">SP</div>

            <div>
              <strong>Sindhu Priya</strong>
              <span>Recruiter workspace</span>
            </div>

            <span>⌄</span>
          </div>
        </header>

        <section className="dashboard-welcome">
          <div>
            <span className="blue-label">
              NEW ANALYSIS
            </span>

            <h2>
              Find the right candidate
              <span>with evidence.</span>
            </h2>

            <p>
              Upload a resume and job description.
              EviMatch will identify matches, verify
              skills, and highlight evidence gaps.
            </p>
          </div>

          <div className="welcome-decoration">
            <div className="orbit orbit-1" />
            <div className="orbit orbit-2" />
            <div className="orbit-center">E</div>
          </div>
        </section>

        <section className="analysis-grid">
          <div className="workspace-card">
            <div className="workspace-heading">
              <div className="step-circle">01</div>

              <div>
                <span>STEP ONE</span>
                <h3>Candidate resume</h3>
              </div>
            </div>

            <label className="drop-zone">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) =>
                  setResume(
                    e.target.files?.[0] || null
                  )
                }
              />

              <div className="upload-cloud">↑</div>

              {resume ? (
                <>
                  <strong>{resume.name}</strong>
                  <span>
                    {(resume.size / 1024 / 1024).toFixed(
                      2
                    )}{" "}
                    MB · PDF
                  </span>
                </>
              ) : (
                <>
                  <strong>
                    Drop your resume here
                  </strong>

                  <span>
                    PDF files up to 10MB
                  </span>

                  <em>Browse files</em>
                </>
              )}
            </label>
          </div>

          <div className="workspace-card">
            <div className="workspace-heading">
              <div className="step-circle">02</div>

              <div>
                <span>STEP TWO</span>
                <h3>Job description</h3>
              </div>

              <span className="character-count">
                {job.length}
              </span>
            </div>

            <textarea
              className="job-textarea"
              placeholder="Paste the job description and requirements here..."
              value={job}
              onChange={(e) => setJob(e.target.value)}
            />

            <div className="textarea-hint">
              <span>AI will extract relevant skills automatically</span>
              <span>⌁</span>
            </div>
          </div>
        </section>

        <div className="analyze-row">
          <button
            className="analyze-new"
            onClick={analyze}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-dot" />
                Analyzing candidate...
              </>
            ) : (
              <>
                Analyze candidate
                <span>→</span>
              </>
            )}
          </button>

          <div className="secure-note">
            <span>✓</span>
            Evidence-aware · Transparent · Secure
          </div>
        </div>

        {loading && (
          <div className="processing-card">
            <div className="processing-icon">
              <span />
            </div>

            <div>
              <strong>Analyzing candidate</strong>
              <p>
                Extracting skills and verifying evidence...
              </p>
            </div>

            <div className="processing-steps">
              <span className="done">✓ Resume</span>
              <span className="done">✓ Skills</span>
              <span className="current">
                ◌ Evidence
              </span>
              <span>○ Insights</span>
            </div>
          </div>
        )}

        {analyzed && !loading && (
          <Results />
        )}
      </main>
    </div>
  );
}

/* ================= RESULTS ================= */

function Results() {
  return (
    <section className="results-new">
      <div className="results-title">
        <div>
          <span className="blue-label">
            ANALYSIS COMPLETE
          </span>

          <h2>Candidate overview</h2>
        </div>

        <div className="ready">
          <span>●</span>
          Analysis ready
        </div>
      </div>

      <div className="metric-grid">
        <Metric
          title="Job match"
          value="86"
          suffix="%"
          text="Strong alignment with role requirements"
        />

        <Metric
          title="Evidence coverage"
          value="78"
          suffix="%"
          text="Requirements supported by evidence"
        />

        <Metric
          title="Uncertainty"
          value="22"
          suffix="%"
          text="Claims requiring verification"
          warning
        />
      </div>

      <div className="result-grid">
        <div className="skills-card">
          <div className="result-card-heading">
            <div>
              <span>SKILL EVIDENCE</span>
              <h3>Verification analysis</h3>
            </div>

            <button>View all →</button>
          </div>

          <div className="skill-items">
            {skills.map((skill) => (
              <div className="skill-item" key={skill.name}>
                <div className="skill-info">
                  <div>
                    <strong>{skill.name}</strong>

                    <Status status={skill.status} />
                  </div>

                  <p>{skill.evidence}</p>
                </div>

                <div className="skill-score">
                  <strong>{skill.confidence}%</strong>

                  <div>
                    <i
                      style={{
                        width: `${skill.confidence}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-star">✦</div>

          <span>AI INSIGHT</span>

          <h3>Strong technical alignment</h3>

          <p>
            The candidate demonstrates strong frontend
            development capabilities with solid evidence
            for React and TypeScript.
          </p>

          <div className="evidence-warning">
            <strong>Evidence gap</strong>

            <span>
              Flask and Docker need stronger supporting
              evidence before they can be considered
              verified.
            </span>
          </div>

          <button>
            Explore recommendations →
          </button>
        </div>
      </div>

      <div className="recommendations-new">
        <div>
          <span>TRACEABILITY</span>
          <h3>Improve evidence confidence</h3>
        </div>

        <div className="recommendation-items">
          <Recommendation
            name="Flask"
            text="Add a project or repository showing Flask API development."
          />

          <Recommendation
            name="Docker"
            text="Provide a deployment example demonstrating Docker usage."
          />

          <Recommendation
            name="Python"
            text="Add specific project evidence instead of only listing the skill."
          />
        </div>
      </div>
    </section>
  );
}

function Metric({
  title,
  value,
  suffix,
  text,
  warning,
}: {
  title: string;
  value: string;
  suffix: string;
  text: string;
  warning?: boolean;
}) {
  return (
    <div className={`metric ${warning ? "metric-warning" : ""}`}>
      <span>{title}</span>

      <strong>
        {value}
        <small>{suffix}</small>
      </strong>

      <p>{text}</p>

      <div className="metric-line">
        <i style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Status({ status }: { status: EvidenceStatus }) {
  return (
    <span
      className={`new-status ${status.toLowerCase()}`}
    >
      {status}
    </span>
  );
}

function Recommendation({
  name,
  text,
}: {
  name: string;
  text: string;
}) {
  return (
    <div className="recommendation-new">
      <div>+</div>

      <section>
        <strong>{name}</strong>
        <p>{text}</p>
      </section>
    </div>
  );
}

export default App;