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

interface AddTemplateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (user: { title: string; content: string }) => void;
  templateTitle: string;
  templateContent: string;
  setTemplateTitle: React.Dispatch<React.SetStateAction<string>>;
  setTemplateContent: React.Dispatch<React.SetStateAction<string>>;
}

const AddTemplateModal: React.FC<AddTemplateModalProps> = ({
  open,
  onClose,
  onSubmit,
  templateTitle,
  templateContent,
  setTemplateTitle,
  setTemplateContent,
}) => {
  const [errors, setErrors] = useState({ title: "", content: "" });

  const validateFields = () => {
    let isValid = true;
    const newErrors = { title: "", content: "" };

    if (!templateTitle.trim()) {
      newErrors.title = "Title is required.";
      isValid = false;
    } else if (templateTitle.length > 50) {
      newErrors.title = "Title must be less than 50 characters.";
      isValid = false;
    }

    if (!templateContent.trim()) {
      newErrors.content = "Content is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "title") setTemplateTitle(value);
    if (name === "content") setTemplateContent(value);

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSubmit = () => {
    if (validateFields()) {
      onSubmit({ title: templateTitle, content: templateContent });
    }
  };

  const handleClose = () => {
    setErrors({ title: "", content: "" });
    setTemplateTitle("");
    setTemplateContent("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className="custom-modal"
      sx={{ "& .MuiPaper-root": { maxWidth: "720px", width: "100%" } }}
    >
      <DialogTitle>Add new template</DialogTitle>
      <DialogContent>
        <Box className="form-fields">
          <TextField
            label="Title"
            name="title"
            value={templateTitle}
            onChange={handleInputChange}
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
            variant="filled"
            inputProps={{ maxLength: 50 }}
            required
          />
          <TextField
            label="Content"
            name="content"
            value={templateContent}
            onChange={handleInputChange}
            error={!!errors.content}
            helperText={errors.content}
            fullWidth
            multiline
            rows={14}
            variant="filled"
            sx={{
              textarea: {
                fontSize: "15px",
                "&::-webkit-scrollbar": {
                  width: "6px",
                  backgroundColor: "transparent",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "transparent",
                  borderRadius: "5px",
                  margin: "6px 0",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#ababab",
                  borderRadius: "5px",
                },
              },
            }}
            required
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "flex-end" }}>
        <Button onClick={handleClose} className="cancel-btn">
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="submit-btn">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTemplateModal;
