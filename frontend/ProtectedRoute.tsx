import React from "react";
import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { apiService } from "@/services/api";


interface ProtectedRouteProps {
  children: React.ReactNode;
}


const ProtectedRoute: React.FC<
  ProtectedRouteProps
> = ({ children }) => {

  const location =
    useLocation();


  const authenticated =
    apiService.isAuthenticated();


  if (!authenticated) {

    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }


  return <>{children}</>;
};


export default ProtectedRoute;