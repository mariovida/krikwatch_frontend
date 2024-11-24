/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";

import styled from "@emotion/styled";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimeField } from "@mui/x-date-pickers/DateTimeField";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ArrowLeftIcon from "../../assets/icons/arrow-left.svg";

import { enUS } from "date-fns/locale";
import de from "date-fns/locale/de";

const customLocale = {
  ...enUS,
  options: { ...enUS.options, weekStartsOn: 1 as const },
  formatLong: de.formatLong,
};

export const StyledDateTimePicker = styled(DateTimePicker)({
  "& .MuiInputBase-input": {
    fontWeight: "400 !important",
  },
  "& .MuiInputLabel-filled": {
    fontWeight: "300 !important",
    fontSize: "16px",
  },
});

const StatusButton = styled(Button)({
  display: "inline-flex",
  alignItems: "center",
  fontSize: "14px",
  lineHeight: "16px",
  padding: "6px 12px",
  color: "#1b2431",
  border: "1px solid #ced4da",
  borderRadius: "16px",
});

const NewIncidentPage = () => {
  const navigate = useNavigate();
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (import.meta.env.VITE_ENV === "production") {
    backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  }

  const [websites, setWebsites] = useState<any[]>([]);
  const [incidentTitle, setIncidentTitle] = useState<string>("");
  const [incidentDescription, setIncidentDescription] = useState<string>("");
  const [selectedWebsite, setSelectedWebsite] = useState<string>("");
  const [incidentDate, setIncidentDate] = useState<any>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [showError, setShowError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWebsites = websites.filter((website) =>
    website.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchWebsites = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${backendUrl}/api/websites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response) {
          const sortedWebsites = response.data.websites.sort(
            (a: any, b: any) => {
              return a.name.localeCompare(b.name, "hr", {
                sensitivity: "base",
              });
            }
          );
          setWebsites(sortedWebsites);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWebsites();
  }, [backendUrl]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!incidentTitle || !selectedWebsite) {
      setShowError(true);
      return;
    }

    const newIncident = {
      title: incidentTitle,
      description: incidentDescription,
      website_id: selectedWebsite,
    };

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${backendUrl}/api/incidents`,
        newIncident,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setIncidentTitle("");
        setSelectedWebsite("");
        handleClose();
      }
    } catch (error) {
      console.error("Error creating website:", error);
      setShowError(true);
    }
  };

  const handleClose = () => {
    navigate(`/incidents`);
  };

  const handleSnackbarClose = () => {
    setShowError(false);
  };

  return (
    <>
      <Helmet>
        <title>New incident | KrikWatch</title>
      </Helmet>

      <section>
        <div className="wrapper">
          <div className="row">
            <div className="col-12">
              <Button className="go-back-btn" onClick={handleClose}>
                <img src={ArrowLeftIcon} />
                All incidents
              </Button>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  marginBottom: "24px",
                }}
              >
                Create new
              </Typography>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={customLocale}
              >
                <form onSubmit={handleSubmit} className="custom-form">
                  <Box
                    className="form-fields"
                    sx={{ marginTop: "0 !important" }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Plus Jakarta Sans, sans-serif",
                        fontSize: "18px",
                        fontWeight: 700,
                        cursor: "default",
                      }}
                    >
                      Incident details
                    </Typography>
                    <FormControl fullWidth variant="filled" required>
                      <InputLabel id="client-select-label">
                        Select website
                      </InputLabel>
                      <Select
                        labelId="client-select-label"
                        value={selectedWebsite}
                        onChange={(e) => setSelectedWebsite(e.target.value)}
                        label="Select website"
                      >
                        <MenuItem value="" disabled>
                          Select website
                        </MenuItem>
                        {websites.map((website) => (
                          <MenuItem key={website.id} value={website.id}>
                            {website.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      label="Title"
                      name="incidentTitle"
                      value={incidentTitle}
                      onChange={(e) => setIncidentTitle(e.target.value)}
                      fullWidth
                      variant="filled"
                      required
                    />
                    <TextField
                      label="Description"
                      name="incidentDescription"
                      value={incidentDescription}
                      onChange={(e) => setIncidentDescription(e.target.value)}
                      fullWidth
                      multiline
                      rows={6}
                      variant="filled"
                    />
                    {/* <FormControl fullWidth variant="filled" required>
                    <InputLabel id="client-select-label">
                      Select website
                    </InputLabel>
                    <Select
                      labelId="client-select-label"
                      value={selectedWebsite}
                      onChange={(e) => setSelectedWebsite(e.target.value)}
                      MenuProps={{
                        PaperProps: {
                          style: { maxHeight: 300 },
                        },
                      }}
                    >
                      <ListSubheader>
                        <TextField
                          autoFocus
                          placeholder="Search..."
                          fullWidth
                          variant="standard"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          InputProps={{
                            disableUnderline: true,
                            style: { padding: "8px" },
                          }}
                        />
                      </ListSubheader>
                      {filteredWebsites.length > 0 ? (
                        filteredWebsites.map((website) => (
                          <MenuItem key={website.id} value={website.id}>
                            {website.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No results found</MenuItem>
                      )}
                    </Select>
                  </FormControl> */}
                    {/* <StyledDateTimePicker
                      label="Start Date *"
                      ampm={false}
                      value={incidentDate}
                      onChange={(value) => setIncidentDate(value)}
                      minutesStep={10}
                      // @ts-ignore
                      renderInput={(params) => <TextField></TextField>}
                      sx={{ width: "100%" }}
                    /> */}
                    <Stack direction="row" sx={{ gap: "16px" }}>
                      <DateTimeField
                        label="Incident start"
                        variant="filled"
                        sx={{ width: "100%" }}
                      />
                      <DateTimeField
                        label="Incident end"
                        variant="filled"
                        sx={{ width: "100%" }}
                      />
                    </Stack>
                    <Typography
                      sx={{
                        fontFamily: "Plus Jakarta Sans, sans-serif",
                        fontSize: "18px",
                        fontWeight: 700,
                        marginTop: "24px",
                        cursor: "default",
                      }}
                    >
                      Select incident status
                    </Typography>
                    <Stack direction="row" sx={{ gap: "8px" }}>
                      <StatusButton>OPEN</StatusButton>
                      <StatusButton>IN PROGRESS</StatusButton>
                      <StatusButton>RESOLVED</StatusButton>
                      <StatusButton>CLOSED</StatusButton>
                    </Stack>
                  </Box>
                  <Box className="action-btns">
                    <Button onClick={handleClose} className="cancel-btn">
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      className="submit-btn"
                      disabled={loading}
                    >
                      Create
                    </Button>
                  </Box>
                </form>
              </LocalizationProvider>
            </div>
          </div>
        </div>
      </section>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={showError}
        onClose={handleSnackbarClose}
        message="Fill all required fields."
        className="snackbar snackbar-error"
        autoHideDuration={4000}
      />
    </>
  );
};

export default NewIncidentPage;
