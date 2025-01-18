import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Checkbox, Typography, Button } from "@mui/material";
import RadioButtonUncheckedOutlinedIcon from "@mui/icons-material/RadioButtonUncheckedOutlined";
import RadioButtonCheckedOutlinedIcon from "@mui/icons-material/RadioButtonCheckedOutlined";

const SetPasswordPage = () => {
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (import.meta.env.VITE_ENV === "production") {
    backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  }

  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    number: false,
    passwordsMatch: false,
  });

  const token = new URLSearchParams(location.search).get("t");

  useEffect(() => {
    const authToken = localStorage.getItem("accessToken");
    if (authToken) {
      navigate("/");
    }
    document.body.classList.add("login-page");
    return () => {
      document.body.classList.remove("login-page");
    };
  }, [navigate]);

  const validatePassword = (password: string, confirmPassword: string) => {
    const lengthRegex = /.{8,}/;
    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;

    setPasswordValidation({
      length: lengthRegex.test(password),
      uppercase: uppercaseRegex.test(password),
      number: numberRegex.test(password),
      passwordsMatch: password === confirmPassword,
    });
  };

  useEffect(() => {
    validatePassword(password, confirmPassword);
  }, [password, confirmPassword]);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      return;
    }

    if (password !== confirmPassword) {
      setError(true);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${backendUrl}/api/users/set-password`,
        { token, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        navigate("/password-created");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const isPasswordValid =
    passwordValidation.length &&
    passwordValidation.uppercase &&
    passwordValidation.number &&
    passwordValidation.passwordsMatch;

  return (
    <div className="row">
      <div className="col-12 col-md-6 d-none d-md-block"></div>
      <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
        <div className="login-box">
          <h2>Set your password</h2>
          <Typography
            sx={{
              fontWeight: 500,
              lineHeight: "22px",
              marginTop: "6px",
            }}
          >
            Create a password for your account.
            <br />
            Once completed, you can log in with your updated credentials.
          </Typography>
          {error && (
            <div
              className="verification-error mt-4"
              style={{ marginBottom: "-16px" }}
            >
              Passwords do not match.
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            style={{ marginTop: "40px", marginBottom: "40px" }}
          >
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              fullWidth
              disabled={loading || !isPasswordValid}
              className="form-confirm"
            >
              Confirm
            </Button>
          </form>
          <div style={{ color: "red", fontSize: "12px" }}>
            <Typography
              sx={{
                width: "100%",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "#f5f5f5",

                span: {
                  color: "#f5f5f5 !important",
                  padding: 0,

                  "&.Mui-checked": {
                    color: "green !important",
                  },

                  svg: {
                    width: "18px",
                    height: "18px",
                  },
                },
              }}
            >
              <Checkbox
                checked={passwordValidation.length}
                icon={<RadioButtonUncheckedOutlinedIcon />}
                checkedIcon={<RadioButtonCheckedOutlinedIcon />}
              />
              At least 8 characters
            </Typography>
            <Typography
              sx={{
                width: "100%",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "#f5f5f5",

                span: {
                  color: "#f5f5f5 !important",
                  padding: 0,

                  "&.Mui-checked": {
                    color: "green !important",
                  },

                  svg: {
                    width: "18px",
                    height: "18px",
                  },
                },
              }}
            >
              <Checkbox
                checked={passwordValidation.uppercase}
                icon={<RadioButtonUncheckedOutlinedIcon />}
                checkedIcon={<RadioButtonCheckedOutlinedIcon />}
              />
              At least one uppercase letter
            </Typography>
            <Typography
              sx={{
                width: "100%",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "#f5f5f5",

                span: {
                  color: "#f5f5f5 !important",
                  padding: 0,

                  "&.Mui-checked": {
                    color: "green !important",
                  },

                  svg: {
                    width: "18px",
                    height: "18px",
                  },
                },
              }}
            >
              <Checkbox
                checked={passwordValidation.number}
                icon={<RadioButtonUncheckedOutlinedIcon />}
                checkedIcon={<RadioButtonCheckedOutlinedIcon />}
              />
              At least one number
            </Typography>
            <Typography
              sx={{
                width: "100%",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "#f5f5f5",

                span: {
                  color: "#f5f5f5 !important",
                  padding: 0,

                  "&.Mui-checked": {
                    color: "green !important",
                  },

                  svg: {
                    width: "18px",
                    height: "18px",
                  },
                },
              }}
            >
              <Checkbox
                checked={
                  passwordValidation.passwordsMatch &&
                  confirmPassword.length > 0
                }
                icon={<RadioButtonUncheckedOutlinedIcon />}
                checkedIcon={<RadioButtonCheckedOutlinedIcon />}
              />
              Passwords match
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetPasswordPage;
