import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Typography } from "@mui/material";

const SetPasswordSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = new URLSearchParams(location.search).get("t");

  useEffect(() => {
    const authToken = localStorage.getItem("accessToken");
    if (authToken) {
      navigate("/");
    }
    if (!token) {
      //navigate("/");
    }
    document.body.classList.add("login-page");
    return () => {
      document.body.classList.remove("login-page");
    };
  }, [navigate, token]);

  const goToPage = () => {
    navigate("/login");
  };

  return (
    <div className="row">
      <div className="col-12 col-md-6 d-none d-md-block"></div>
      <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
        <div
          className="login-box"
          style={{
            display: "flex",
            gap: "80px",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div>
            <h2>Password is set</h2>
            <Typography
              sx={{
                fontWeight: 500,
                lineHeight: "22px",
                marginTop: "6px",
              }}
            >
              Log in with your new password.
            </Typography>
          </div>
          <button
            onClick={goToPage}
            style={{
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
        </div>
      </div>
    </div>
  );
};

export default SetPasswordSuccessPage;
