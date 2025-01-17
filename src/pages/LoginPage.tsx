import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Helmet } from "react-helmet-async";

const LoginPage = () => {
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (import.meta.env.VITE_ENV === "production") {
    backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  }

  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorVerification, setErrorVerification] = useState(false);
  const [errorMail, setErrorMail] = useState(false);
  const [errorDisabled, setErrorDisabled] = useState(false);
  const [error, setError] = useState(false);
  const [backendStatus, setBackendStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/status`);
        if (response.ok) {
          setBackendStatus(true);
        } else {
          setBackendStatus(false);
        }
      } catch {
        setBackendStatus(false);
      }
    };

    checkBackendStatus();

    const authToken = localStorage.getItem("accessToken");
    if (authToken) {
      navigate("/");
    }
    document.body.classList.add("login-page");
    return () => {
      document.body.classList.remove("login-page");
    };
  }, [navigate]);

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const response = await fetch(`${backendUrl}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      credentials: "include",
    });

    const data = await response.json();
    if (response.ok && data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      navigate("/");
    } else {
      setErrorMail(data.error === "User not found");
      setErrorVerification(data.error === "Account not verified");
      setErrorDisabled(data.error === "Account disabled");
      setError(data.error === "Invalid");
    }
  };

  const goToPage = () => {
    navigate("/forgot-password");
  };

  return (
    <>
      <Helmet>
        <title>Login | KrikWatch</title>
      </Helmet>
      {backendStatus ? (
        <section className="backend-status">
          <span className="loader"></span>
        </section>
      ) : (
        <section className="backend-status backend-status_failed">
          <span className="loader"></span>
        </section>
      )}
      <div className="row">
        <div className="col-12 col-md-6 d-none d-md-block"></div>
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
          <div className="login-box">
            <h2>Log in</h2>
            <form onSubmit={handleLogin}>
              {errorVerification && (
                <div className="verification-error">
                  Your account hasn't been verified.
                </div>
              )}
              {errorDisabled && (
                <div className="verification-error">
                  This account is disabled.
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
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <input type="submit" value="Log in" name="login" />
            </form>

            <button onClick={goToPage}>Forgot password?</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
