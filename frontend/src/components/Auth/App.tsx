import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "@/pages/Home";

const App: React.FC = () => {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={<Navigate to="/" replace />}
        />

        <Route
          path="/register"
          element={<Navigate to="/" replace />}
        />

        <Route
          path="/"
          element={<Home />}
        />

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

    </BrowserRouter>
  );
};

export default App;