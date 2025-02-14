import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useUser } from "../context/UserContext";
import axios from "axios";

import { Box, TextField, Button, Typography } from "@mui/material";
import ConfirmationModal from "../blocks/ConfirmationModal";

const NotificationsPage = () => {
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (import.meta.env.VITE_ENV === "production") {
    backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  }

  const { user } = useUser();
  const [userId, setUserId] = useState<number | null>(null);
  const [successModal, setSuccessModal] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const [alertEmails, setAlertEmails] = useState<any[]>([]);
  const [loadingAlertEmails, setLoadingAlertEmails] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const loggedInEmail = user?.email;
        if (loggedInEmail) {
          const response = await fetch(
            `${backendUrl}/api/users/user-id?email=${encodeURIComponent(loggedInEmail)}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setUserId(data.user);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (user) {
      fetchUserId();
    }
  }, [backendUrl]);

  useEffect(() => {
    if (userId !== null) {
      fetchAlertEmails(userId);
    }
  }, [userId]);

  const fetchAlertEmails = async (userId: number) => {
    setLoadingAlertEmails(true);
    try {
      const token = localStorage.getItem("accessToken");
      const responseAlerts = await axios.get(
        `${backendUrl}/api/users/get-alerts/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAlertEmails(responseAlerts.data.alertEmails);
    } catch (error) {
      console.error("Error fetching alert emails:", error);
    } finally {
      setLoadingAlertEmails(false);
    }
  };

  console.log(alertEmails);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setEmailError("Email address is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setSuccessModal(false);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${backendUrl}/api/users/add-alert`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userId, emailAddress: email }),
      });

      if (response.ok) {
        setSuccessModal(true);
        setEmail("");
      } else {
        const errorData = await response.json();
        setEmailError(errorData.message || "Failed to add email address.");
      }
    } catch (error) {
      console.error("Error adding email address:", error);
    }
  };
  return (
    <>
      <Helmet>
        <title>Notifications | KrikWatch</title>
      </Helmet>

      <section style={{ marginBottom: "40px" }}>
        <div className="wrapper">
          <div className="row">
            <div className="col-8 offset-2">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#fee4e2",
                  padding: "16px",
                  marginBottom: "24px",
                  borderRadius: "10px",
                }}
              >
                <Typography
                  sx={{ fontSize: "18px", fontWeight: 600, lineHeight: "22px" }}
                >
                  Work in progress
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ marginBottom: "16px" }}>
                Add email address
              </Typography>
              <Typography sx={{ marginBottom: "16px" }}>
                Add an email address where you will receive notifications if the
                website is down.
              </Typography>
              <form onSubmit={handleSubmit} className="custom-form">
                <Box
                  className="form-fields"
                  sx={{
                    marginTop: "0 !important",
                    marginBottom: "32px !important",
                  }}
                >
                  {emailError && (
                    <div
                      className="error-message"
                      style={{ marginBottom: "-8px" }}
                    >
                      {emailError}
                    </div>
                  )}
                  <TextField
                    label="Email address"
                    name="email"
                    value={email}
                    onChange={handleInputChange}
                    fullWidth
                    variant="filled"
                    required
                  />
                </Box>
                <Box className="action-btns">
                  <Button onClick={handleSubmit} className="submit-btn">
                    Confirm
                  </Button>
                </Box>
              </form>
            </div>
          </div>
        </div>
      </section>
      <ConfirmationModal
        open={successModal}
        onClose={() => setSuccessModal(false)}
        onConfirm={() => setSuccessModal(false)}
        confirmText="Email address has been added successfully."
        confirmTitle="Email address added"
        buttonText="Confirm"
      />
    </>
  );
};

export default NotificationsPage;
