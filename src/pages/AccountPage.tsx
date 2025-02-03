import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useUser } from "../context/UserContext";

import { Box, TextField, Button, Typography, Tabs, Tab } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import ConfirmationModal from "../blocks/ConfirmationModal";

const AccountPage = () => {
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (import.meta.env.VITE_ENV === "production") {
    backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  }

  const { user, setUser } = useUser();
  const [userId, setUserId] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successModal, setSuccessModal] = useState<boolean>(false);
  const [successPasswordModal, setSuccessPasswordModal] =
    useState<boolean>(false);
  const [showRequiredError, setShowRequiredError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [updatedUserData, setUpdatedUserData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirm: "",
  });

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

        //setUserId(response.data.users);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (user) {
      fetchUserId();
    }
  }, [backendUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (
      ["current_password", "new_password", "new_password_confirm"].includes(
        name
      )
    ) {
      setPasswordData((prev) => ({ ...prev, [name]: value }));
    } else {
      setUpdatedUserData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!updatedUserData.first_name || !updatedUserData.last_name) {
      setShowRequiredError(true);
      return;
    }

    setIsSaving(true);
    setSuccessModal(false);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${backendUrl}/api/users/update-user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: updatedUserData.first_name,
          last_name: updatedUserData.last_name,
          email: updatedUserData.email,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        if (updatedUser && updatedUser.user) {
          localStorage.setItem("user", JSON.stringify(updatedUser.user));
          setUser(updatedUser.user);
        }
        setSuccessModal(true);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { current_password, new_password, new_password_confirm } =
      passwordData;

    if (!current_password || !new_password || !new_password_confirm) {
      setPasswordError("All password fields are required.");
      return;
    }

    if (new_password !== new_password_confirm) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    setIsSaving(true);
    setPasswordError(null);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${backendUrl}/api/users/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          current_password,
          new_password,
        }),
      });

      if (response.ok) {
        const responsePasswordChanged = await response.json();
        if (
          responsePasswordChanged &&
          responsePasswordChanged.message &&
          responsePasswordChanged.message === "Current password is incorrect."
        ) {
          setPasswordError("Current password is incorent.");
          return;
        }

        setPasswordData({
          current_password: "",
          new_password: "",
          new_password_confirm: "",
        });
        setSuccessPasswordModal(true);
      } else {
        const errorData = await response.json();
        setPasswordError(errorData.message || "Failed to change password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Account settings | Krik Monitoring</title>
      </Helmet>

      <section>
        <div className="wrapper">
          <div className="row">
            <div className="col-8 offset-2">
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "#ced4da" }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="account settings tabs"
                  >
                    <Tab label="Account details" />
                    <Tab label="Password" />
                  </Tabs>
                </Box>
                {value === 0 && (
                  <TabPanel value={value} sx={{ padding: 0 }}>
                    <Typography
                      variant="h4"
                      sx={{ marginTop: "40px", marginBottom: "20px" }}
                    >
                      Update account details
                    </Typography>
                    <form
                      onSubmit={handleProfileSubmit}
                      className="custom-form"
                    >
                      <Box
                        className="form-fields"
                        sx={{
                          marginTop: "0 !important",
                          marginBottom: "32px !important",
                        }}
                      >
                        {showRequiredError && (
                          <div
                            className="error-message"
                            style={{ marginBottom: "-8px" }}
                          >
                            First and last name are required.
                          </div>
                        )}
                        <TextField
                          label="First name"
                          name="first_name"
                          value={updatedUserData.first_name}
                          onChange={handleInputChange}
                          fullWidth
                          variant="filled"
                          inputProps={{ maxLength: 50 }}
                          required
                        />
                        <TextField
                          label="Last name"
                          name="last_name"
                          value={updatedUserData.last_name}
                          onChange={handleInputChange}
                          fullWidth
                          variant="filled"
                          inputProps={{ maxLength: 50 }}
                          required
                        />
                        <TextField
                          label="Email address"
                          name="email"
                          value={updatedUserData.email}
                          fullWidth
                          variant="filled"
                          required
                          disabled
                          sx={{
                            ".Mui-disabled": {
                              backgroundColor: "transparent",
                            },
                          }}
                        />
                      </Box>
                      <Box className="action-btns">
                        <Button
                          onClick={handleProfileSubmit}
                          className="submit-btn"
                        >
                          Confirm
                        </Button>
                      </Box>
                    </form>
                  </TabPanel>
                )}
                {value === 1 && (
                  <TabPanel value={value} sx={{ padding: 0 }}>
                    <Typography
                      variant="h4"
                      sx={{ marginTop: "40px", marginBottom: "20px" }}
                    >
                      Change password
                    </Typography>
                    <form
                      onSubmit={handlePasswordSubmit}
                      className="custom-form"
                    >
                      <Box
                        className="form-fields"
                        sx={{
                          marginTop: "0 !important",
                          marginBottom: "32px !important",
                        }}
                      >
                        {passwordError && (
                          <div
                            className="error-message"
                            style={{ marginBottom: "-8px" }}
                          >
                            {passwordError}
                          </div>
                        )}
                        <TextField
                          label="Current password"
                          name="current_password"
                          type="password"
                          value={passwordData.current_password}
                          onChange={handleInputChange}
                          fullWidth
                          variant="filled"
                          required
                        />
                        <TextField
                          label="New password"
                          name="new_password"
                          type="password"
                          value={passwordData.new_password}
                          onChange={handleInputChange}
                          fullWidth
                          variant="filled"
                          required
                        />
                        <TextField
                          label="Confirm password"
                          name="new_password_confirm"
                          type="password"
                          value={passwordData.new_password_confirm}
                          onChange={handleInputChange}
                          fullWidth
                          variant="filled"
                          required
                        />
                      </Box>
                      <Box className="action-btns">
                        <Button
                          onClick={handlePasswordSubmit}
                          className="submit-btn"
                        >
                          Confirm
                        </Button>
                      </Box>
                    </form>
                  </TabPanel>
                )}
              </TabContext>
            </div>
          </div>
        </div>
      </section>
      <ConfirmationModal
        open={successModal}
        onClose={() => setSuccessModal(false)}
        onConfirm={() => setSuccessModal(false)}
        confirmText="User updated successfully."
        confirmTitle="User updated"
        buttonText="Confirm"
      />
      <ConfirmationModal
        open={successPasswordModal}
        onClose={() => setSuccessPasswordModal(false)}
        onConfirm={() => setSuccessPasswordModal(false)}
        confirmText="Password changed successfully."
        confirmTitle="Password changed"
        buttonText="Confirm"
      />
    </>
  );
};

export default AccountPage;
