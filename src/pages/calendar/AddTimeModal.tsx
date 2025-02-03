/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { DateTimeField } from "@mui/x-date-pickers/DateTimeField";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";

interface AddTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newEvent: { user_name: string; start_time: string; end_time: string }) => void;
  selectedDate: { start: Date; end: Date } | null;
}

const AddTimeModal: React.FC<AddTimeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  selectedDate,
}) => {
  const [userName, setUserName] = useState<string>("");
  const [startTime, setStartTime] = useState<any>(null);
    const [endTime, setEndTime] = useState<any>(null);

  // Handle input changes
  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const handleStartTimeChange = (newValue: Date | null) => {
    setStartTime(newValue);
  };

  const handleEndTimeChange = (newValue: Date | null) => {
    setEndTime(newValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userName && startTime && endTime) {
      try {
        const formattedStartTime = moment(startTime).toISOString();
        const formattedEndTime = moment(endTime).toISOString();

        onSubmit({
          user_name: userName,
          start_time: formattedStartTime,
          end_time: formattedEndTime,
        });
        onClose(); // Close modal after submitting
      } catch (error) {
        console.error("Error adding availability:", error);
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="custom-modal"
      sx={{
        "& .MuiPaper-root": {
          maxWidth: "500px",
          width: "100%",
        },
      }}
    >
      <DialogTitle>Add Availability</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <Box className="form-fields">
            <TextField
              label="Name"
              name="name"
              value={userName}
              onChange={handleUserNameChange}
              fullWidth
              variant="filled"
              margin="normal"
            />
            <DateTimeField
                label="Start time"
                variant="filled"
                onChange={(newValue) => setStartTime(newValue)}
            />
            <DateTimeField
                label="End time"
                variant="filled"
                onChange={(newValue) => setEndTime(newValue)}
            />
          </Box>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} className="cancel-btn">
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="submit-btn">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTimeModal;