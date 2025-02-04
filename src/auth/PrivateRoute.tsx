import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

const LoadingSpinner = () => {
  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress sx={{ height: "6px" }} />
    </Box>
    // <div className="loading-spinner">
    //   <span>Loading...</span>
    // </div>
  );
};

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const [loading, setLoading] = useState(true);
  const [showTest, setShowTest] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setAuthToken(token);
    setLoading(false);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
