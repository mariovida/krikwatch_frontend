import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useUser } from "../context/UserContext";

import {
  Box,
  TextField,
  Button,
} from "@mui/material";

const AccountPage = () => {
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (import.meta.env.VITE_ENV === "production") {
    backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  }

  const { user, setUser } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [updatedUserData, setUpdatedUserData] = useState({
    name: user?.first_name || "",
    surname: user?.last_name || "",
    email: user?.email || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
     return
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };


  return (<>
    <Helmet>
      <title>Account settings | KrikWatch</title>
    </Helmet>

    <section>
    <div className="wrapper">
      <div className="row">
        <div className="col-8 offset-2">
        <form onSubmit={handleSubmit} className="custom-form">
          <Box className="form-fields" sx={{ marginTop: "0 !important" }}>
            <TextField
              label="First name"
              name="first_name"
              value={updatedUserData.name}
              onChange={handleInputChange}
              
              fullWidth
              variant="filled"
              inputProps={{ maxLength: 50 }}
              required
            />
            <TextField
              label="Last name"
              name="last_name"
              value={updatedUserData.surname}
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
              sx={{ '.Mui-disabled': { backgroundColor: 'transparent' } }}
            />
          </Box>
          <Box className="action-btns">
            <Button
              onClick={handleSubmit}
              className="submit-btn"
            >
              Create
            </Button>
          </Box>
        </form>
        </div>
      </div>
    </div>
    </section></>
  );
};

export default AccountPage;
