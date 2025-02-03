import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment, { Moment } from "moment";
import axios from "axios";

interface AddTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: {
    id?: number;
    user_name: string;
    start_time: string;
    end_time: string;
  }) => void;
  selectedDate: { start: Date; end: Date } | null;
  eventToEdit?: { id?: number; title: string; start: Date; end: Date } | null;
}

const AddTimeModal: React.FC<AddTimeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  selectedDate,
  eventToEdit,
}) => {
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (import.meta.env.VITE_ENV === "production") {
    backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  }

  const [userName, setUserName] = useState<string>("");
  const [startTime, setStartTime] = useState<Moment | null>(null);
  const [endTime, setEndTime] = useState<Moment | null>(null);

  useEffect(() => {
    if (eventToEdit) {
      setUserName(eventToEdit.title);
      setStartTime(moment(eventToEdit.start));
      setEndTime(moment(eventToEdit.end));
    } else if (selectedDate) {
      setUserName("");
      setStartTime(moment(selectedDate.start));
      setEndTime(moment(selectedDate.end));
    } else {
      setUserName("");
      setStartTime(moment().startOf("day"));
      setEndTime(moment().startOf("day"));
    }
  }, [eventToEdit, selectedDate]);

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const handleDelete = async () => {
    if (eventToEdit && eventToEdit.id) {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.delete(
          `${backendUrl}/api/calendar/delete-availability/${eventToEdit.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          onClose();
          window.location.reload();
        }
      } catch (error) {
        console.error("Error deleting availability:", error);
        alert("Failed to delete availability");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userName && startTime && endTime) {
      try {
        onSubmit({
          id: eventToEdit?.id,
          user_name: userName,
          start_time: startTime.format("YYYY-MM-DDTHH:mm:ss"),
          end_time: endTime.format("YYYY-MM-DDTHH:mm:ss"),
        });
        onClose();
      } catch (error) {
        console.error("Error adding/updating availability:", error);
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
          maxWidth: "540px",
          width: "100%",
        },
      }}
    >
      <DialogTitle>
        {eventToEdit ? "Edit availability" : "Add availability"}
      </DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <Box className="form-fields">
            <TextField
              label="Name"
              name="name"
              value={eventToEdit?.title ? eventToEdit.title : userName}
              onChange={handleUserNameChange}
              fullWidth
              variant="filled"
            />
            <DateTimePicker
              label="Start time"
              value={startTime}
              defaultValue={
                selectedDate
                  ? moment(selectedDate.start).startOf("day")
                  : moment().startOf("day")
              }
              onChange={(newValue) =>
                setStartTime(newValue ? moment(newValue) : null)
              }
              format="DD.MM.YYYY HH:mm"
              ampm={false}
              slotProps={{
                textField: {
                  placeholder: "",
                  InputLabelProps: { shrink: false },
                },
              }}
              sx={{
                width: "100%",
                ".MuiInputLabel-root": {
                  display: "none",
                },
                ".MuiOutlinedInput-notchedOutline": {
                  border: 0,
                },
              }}
            />
            <DateTimePicker
              label="End time"
              value={endTime}
              defaultValue={
                selectedDate
                  ? moment(selectedDate.end).startOf("day")
                  : moment().startOf("day")
              }
              onChange={(newValue) => setEndTime(moment(newValue))}
              format="DD.MM.YYYY HH:mm"
              ampm={false}
              minDateTime={startTime || undefined}
              slotProps={{
                textField: {
                  placeholder: "",
                  InputLabelProps: { shrink: false },
                },
              }}
              sx={{
                width: "100%",
                ".MuiInputLabel-root": {
                  display: "none",
                },
              }}
            />
          </Box>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "space-between" }}>
        {eventToEdit && (
          <Button className="delete-btn" onClick={handleDelete}>
            Delete availability
          </Button>
        )}
        <div>
          <Button onClick={onClose} className="cancel-btn">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="submit-btn"
            disabled={!userName || !startTime || !endTime}
          >
            {eventToEdit ? "Update" : "Add"}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default AddTimeModal;
