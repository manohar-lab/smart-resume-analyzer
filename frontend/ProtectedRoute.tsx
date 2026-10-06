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
  return <>{children}</>;
};


export default ProtectedRoute;