import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import axios from "axios";

import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (user: {
    first_name: string;
    last_name: string;
    email: string;
  }) => void;
  editMode: boolean;
  user?:
    | {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        is_verified: number;
        verified: boolean;
      }
    | null
    | undefined;
  firstName: string;
  lastName: string;
  email: string;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  open,
  onClose,
  onSubmit,
  editMode = false,
  user,
  firstName,
  lastName,
  email,
  setFirstName,
  setLastName,
  setEmail,
}) => {
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (import.meta.env.VITE_ENV === "production") {
    backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  }

  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const { user: currentUser } = useUser();

  const [initialFirstName, setInitialFirstName] = useState<string>("");
  const [initialLastName, setInitialLastName] = useState<string>("");

  useEffect(() => {
    if (editMode && user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setEmail(user.email || "");
      setInitialFirstName(user.first_name || "");
      setInitialLastName(user.last_name || "");
    }
    if (!editMode) {
      setFirstName("");
      setLastName("");
      setEmail("");
    }
  }, [editMode, user, setFirstName, setLastName, setEmail]);

  const validateFields = () => {
    let isValid = true;
    const newErrors = { first_name: "", last_name: "", email: "" };

    if (!firstName.trim()) {
      newErrors.first_name = "First name is required.";
      isValid = false;
    } else if (firstName.length > 50) {
      newErrors.first_name = "First name must be less than 50 characters.";
      isValid = false;
    }

    if (!lastName.trim()) {
      newErrors.last_name = "Last name is required.";
      isValid = false;
    } else if (lastName.length > 50) {
      newErrors.last_name = "Last name must be less than 50 characters.";
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "first_name") setFirstName(value);
    if (name === "last_name") setLastName(value);
    if (name === "email") setEmail(value);

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSubmit = () => {
    if (validateFields()) {
      onSubmit({ first_name: firstName, last_name: lastName, email });
    }
  };

  const handleClose = () => {
    setErrors({ first_name: "", last_name: "", email: "" });
    if (!editMode) {
      setFirstName("");
      setLastName("");
      setEmail("");
    } else {
      setFirstName(user?.first_name || "");
      setLastName(user?.last_name || "");
    }
    onClose();
  };

  const handleDisableUser = async () => {
    try {
      if (user) {
        const token = localStorage.getItem("accessToken");
        const response = await axios.put(
          `${backendUrl}/api/users/${user.id}/toggle-verification`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Error toggling the user's verification status:", error);
    }
  };

  const isSaveDisabled =
    firstName === initialFirstName && lastName === initialLastName;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className="custom-modal"
      sx={{
        "& .MuiPaper-root": {
          maxWidth: "540px",
          width: "100%",
        },
      }}
    >
      <DialogTitle>{editMode ? "Edit user" : "Add new user"}</DialogTitle>
      <DialogContent>
        <Box className="form-fields">
          <TextField
            label="First name"
            name="first_name"
            value={firstName}
            onChange={handleInputChange}
            error={!!errors.first_name}
            helperText={errors.first_name}
            fullWidth
            variant="filled"
            inputProps={{ maxLength: 50 }}
            required
          />
          <TextField
            label="Last name"
            name="last_name"
            value={lastName}
            onChange={handleInputChange}
            error={!!errors.last_name}
            helperText={errors.last_name}
            fullWidth
            variant="filled"
            inputProps={{ maxLength: 50 }}
            required
          />
          <TextField
            label="Email"
            name="email"
            value={email}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            variant="filled"
            disabled={editMode}
            required
          />
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "space-between !important",
        }}
      >
        {user && currentUser && currentUser.email !== user.email ? (
          user.is_verified === 1 ? (
            <Button className="delete-btn" onClick={handleDisableUser}>
              Disable user
            </Button>
          ) : user.verified ? (
            <Button
              className="delete-btn"
              sx={{ color: "#1b2431 !important" }}
              onClick={handleDisableUser}
            >
              Enable user
            </Button>
          ) : (
            <Button className="delete-btn"></Button>
          )
        ) : (
          <Button className="delete-btn"></Button>
        )}
        <div>
          <Button onClick={handleClose} className="cancel-btn">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="submit-btn"
            disabled={isSaveDisabled}
          >
            {editMode ? "Save changes" : "Create"}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserModal;
