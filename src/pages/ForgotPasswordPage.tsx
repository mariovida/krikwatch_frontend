import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";

import { Typography } from "@mui/material";

const ForgotPasswordPage = () => {
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (import.meta.env.VITE_ENV === "production") {
    backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  }

  const [email, setEmail] = useState("");
  const [errorMail, setErrorMail] = useState(false);
  const [successMessage, showSuccessMessage] = useState(false);
  const [inProgress, setInProgress] = useState(false);
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

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMail(false);
    showSuccessMessage(false);

    try {
      setInProgress(true);
      const response = await axios.post(`${backendUrl}/api/forgot-password`, {
        email,
      });

      if (response) {
        if (
          response.data &&
          response.data.message &&
          response.data.message === "Email not found"
        ) {
          setErrorMail(true);
          setInProgress(false);
          return;
        } else {
          showSuccessMessage(true);
          setInProgress(false);
        }
      }
    } catch (err: any) {
      console.error("Error:", err);
      setInProgress(false);
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <Helmet>
        <title>Reset password | KrikWatch</title>
      </Helmet>
      <div className="row">
        <div className="col-12 col-md-6 d-none d-md-block"></div>
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
          <div className="login-box">
            {!successMessage && (
              <button onClick={goToLogin} className="back-btn">
                Back to login
              </button>
            )}
            <h2>Reset password</h2>
            <Typography
              sx={{ fontWeight: 400, lineHeight: "22px", marginTop: "6px" }}
            >
              Please enter your email address to request a password reset.
            </Typography>

            {!successMessage ? (
              <form onSubmit={handleLogin} className="mb-0">
                {errorMail && (
                  <div className="verification-error">
                    No account found with that email address.
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
                <input
                  disabled={inProgress}
                  type="submit"
                  value="Confirm"
                  name="confirm"
                />
              </form>
            ) : (
              <>
                <Typography
                  sx={{
                    fontWeight: 400,
                    lineHeight: "22px",
                    marginTop: "56px",
                    marginBottom: "24px",
                  }}
                >
                  An email with a password reset link has been sent to your
                  inbox. Please check your email and follow the instructions to
                  reset your password.
                </Typography>
                <button
                  onClick={goToLogin}
                  style={{
                    width: "100%",
                    fontSize: "16px",
                    fontWeight: "600",
                    lineHeight: "18px",
                    letterSpacing: "0.5px",
                    padding: "16px 14px",
                    color: "#ffffff",
                    backgroundColor: "#877eb4",
                    marginBottom: "0",
                    border: "0",
                    borderRadius: "5px",
                    transition: "0.2s",
                  }}
                >
                  Login page
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
