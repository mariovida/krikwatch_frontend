import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Typography } from "@mui/material";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [errorVerification, setErrorVerification] = useState(false);
  const [errorMail, setErrorMail] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    if (isLoggedIn) {
      navigate("/");
    }
    document.body.classList.add("login-page");
    return () => {
      document.body.classList.remove("login-page");
    };
  }, [navigate]);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="row">
      <div className="col-12 col-md-6"></div>
      <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
        <div className="login-box">
          <button onClick={goToLogin} className="back-btn">
            Back to login
          </button>
          <h2>Reset password</h2>
          <Typography
            sx={{
              fontWeight: 500,
              lineHeight: "22px",
              marginTop: "6px",
            }}
          >
            Please enter your email address to request a password reset.
          </Typography>

          <form onSubmit={handleLogin} className="mb-0">
            {errorVerification && (
              <div className="verification-error">
                Your account hasn't been verified.
              </div>
            )}
            {errorMail && (
              <div className="verification-error">
                No account found with that email address.
              </div>
            )}
            {error && (
              <div className="verification-error">
                Entered password is incorrect.
              </div>
            )}

            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input type="submit" value="Confirm" name="confirm" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
