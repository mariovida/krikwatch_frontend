import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <span>Loading...</span>
    </div>
  );
};

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const [loading, setLoading] = useState(true);
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
