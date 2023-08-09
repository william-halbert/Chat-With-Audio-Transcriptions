import React from "react";
import { getAuth } from "firebase/auth";
import { Route, Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const auth = getAuth();
  const user = auth.currentUser;
  return user ? children : <Navigate to="/" replace />;
}
