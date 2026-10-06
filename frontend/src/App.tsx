import React, { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Provider, useDispatch } from "react-redux";
import { store, AppDispatch } from "@/store";
import { setCurrentUser } from "@/store/authSlice";

import { apiService } from "@/services/api";

import Home from "@/pages/Home";
import Analysis from "@/pages/Analysis";
import AnalysisDetail from "@/pages/AnalysisDetail";

import {
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6366f1",
    },
    secondary: {
      main: "#8b5cf6",
    },
    success: {
      main: "#10b981",
    },
    warning: {
      main: "#f59e0b",
    },
    error: {
      main: "#ef4444",
    },
    background: {
      default: "#f5f7fb",
    },
  },

  typography: {
    fontFamily:
      "Inter, Arial, Helvetica, sans-serif",

    h1: {
      fontWeight: 800,
    },

    h2: {
      fontWeight: 700,
    },

    h3: {
      fontWeight: 700,
    },

    h4: {
      fontWeight: 700,
    },

    h5: {
      fontWeight: 600,
    },

    h6: {
      fontWeight: 600,
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 10,
          fontWeight: 600,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});


const AppContent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await apiService.getCurrentUser();

        dispatch(
          setCurrentUser(user)
        );
      } catch (error) {
        console.error(
          "Could not load current user:",
          error
        );
      }
    };

    loadUser();
  }, [dispatch]);


  return (
    <ThemeProvider theme={theme}>

      <CssBaseline />

      <Routes>

        {/* ================= AUTH ================= */}

        <Route
          path="/login"
          element={<Navigate to="/" replace />}
        />

        <Route
          path="/register"
          element={<Navigate to="/" replace />}
        />


        {/* ================= DASHBOARD ================= */}

        <Route
          path="/"
          element={<Home />}
        />


        <Route
          path="/dashboard"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />


        {/* ================= ANALYSIS ================= */}

        <Route
          path="/analysis"
          element={<Analysis />}
        />


        <Route
          path="/analysis/:analysisId"
          element={<AnalysisDetail />}
        />


        {/* ================= PROFILE ================= */}

        <Route
          path="/profile"
          element={<ProfilePlaceholder />}
        />


        {/* ================= 404 ================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </ThemeProvider>
  );
};


const ProfilePlaceholder: React.FC = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7fb",
        fontFamily: "Inter, Arial",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "20px",
          boxShadow:
            "0 10px 40px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "50px",
            marginBottom: "15px",
          }}
        >
          👤
        </div>

        <h2>
          Profile
        </h2>

        <p>
          Profile page coming soon.
        </p>

      </div>
    </div>
  );
};


const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};


export default App;