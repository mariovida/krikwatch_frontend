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
  onSubmit: (client: { name: string; logo?: File }) => void;
  editMode: boolean;
  client?: { name: string; logo?: string } | null | undefined;
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
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (editMode && client) {
      setName(client.name || "");
      if (client.logo) {
        setLogoPreview(client.logo);
      }
    }
    if (!editMode) {
      setName("");
      setLogo(null);
      setLogoPreview(null);
    }
  }, [editMode, client, setName]);

  const validateFields = () => {
    let isValid = true;
    const newErrors = { name: "" };

    if (!name.trim()) {
      newErrors.name = "Name is required.";
      isValid = false;
    } else if (name.length > 50) {
      newErrors.name = "Name must be less than 50 characters.";
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

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

  const handleSubmit = () => {
    if (validateFields()) {
      onSubmit({ name, logo: logo || undefined });
    }
  };

  const handleClose = () => {
    setErrors({ name: "" });
    if (!editMode) {
      setName("");
      setLogo(null);
      setLogoPreview(null);
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
          {/* <Box>
            <TextField
              type="file"
              inputProps={{ accept: "image/*" }}
              onChange={handleLogoChange}
              fullWidth
              variant="filled"
              sx={{
                "& .MuiFilledInput-root": {
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px",
                  padding: "8px 12px",
                },
                "& .upload-button": {
                  display: "inline-block",
                  padding: "8px 16px",
                  backgroundColor: "#3f51b5",
                  color: "#fff",
                  borderRadius: "4px",
                  cursor: "pointer",
                  textAlign: "center",
                  width: "100%",
                },
              }}
            />
            {logoPreview && (
              <Box mt={2}>
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              </Box>
            )}
          </Box> */}
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
