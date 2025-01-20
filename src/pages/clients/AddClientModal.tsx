import React, { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

interface AddClientModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (client: {
    name: string;
  }) => void;
  editMode: boolean;
  client?: { name: string } | null | undefined;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
}

const AddClientModal: React.FC<AddClientModalProps> = ({
  open,
  onClose,
  onSubmit,
  editMode = false,
  client,
  name,
  setName,
}) => {
  const [errors, setErrors] = useState({
    name: "",
  });

  useEffect(() => {
    if (editMode && client) {
      setName(client.name || "");
    }
    if(!editMode) {
        setName("");
    }
  }, [editMode, client, setName]);

  const validateFields = () => {
    let isValid = true;
    const newErrors = { name: "" };

    if (!name.trim()) {
      newErrors.name = "First name is required.";
      isValid = false;
    } else if (name.length > 50) {
      newErrors.name = "First name must be less than 50 characters.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSubmit = () => {
    if (validateFields()) {
      onSubmit({ name: name });
    }
  };

  const handleClose = () => {
    setErrors({ name: "" });
    if(!editMode) {
      setName("");
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className="custom-modal"
      sx={{
        "& .MuiPaper-root": {
          maxWidth: "500px",
          width: "100%",
        },
      }}
    >
      <DialogTitle>{editMode ? "Edit client" : "Add new client"}</DialogTitle>
      <DialogContent>
        <Box className="form-fields">
          <TextField
            label="Client name"
            name="name"
            value={name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            variant="filled"
            inputProps={{ maxLength: 50 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} className="cancel-btn">
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="submit-btn">
          {editMode ? "Save changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddClientModal;
