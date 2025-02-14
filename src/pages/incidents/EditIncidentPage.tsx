/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { useUser } from "../../context/UserContext";
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
import ConfirmationModal from "../../blocks/ConfirmationModal";

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

const EditIncidentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (import.meta.env.VITE_ENV === "production") {
    backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  }
  const { user } = useUser();

  const [incident, setIncident] = useState<any>(null);
  const [websites, setWebsites] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showError, setShowError] = useState<boolean>(false);
  const [successModal, setSuccessModal] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState("OPEN");

  useEffect(() => {
    const fetchIncident = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${backendUrl}/api/incidents/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response) {
          setIncident(response.data.incident);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchIncident();
    }
  }, [backendUrl, id]);

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
    if (!incident.title || !incident.website_id) {
      setShowError(true);
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(`${backendUrl}/api/incident/${id}`, incident, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setSuccessModal(true);
    } catch (error) {
      console.error("Error updating incident:", error);
      setShowError(true);
    }
  };

  const handleClose = () => {
    setSuccessModal(false);
    navigate(`/incidents`);
  };

  return (
    <>
      <Helmet>
        <title>Edit incident | Krik Monitoring</title>
      </Helmet>

      <section style={{ paddingBottom: "80px" }}>
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
                Edit incident
              </Typography>
              {incident && (
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
                          value={incident.website_id}
                          onChange={(e) =>
                            setIncident({
                              ...incident,
                              website_id: e.target.value,
                            })
                          }
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
                        value={incident.title}
                        onChange={(e) =>
                          setIncident({ ...incident, title: e.target.value })
                        }
                        fullWidth
                        variant="filled"
                        required
                      />
                      <Stack direction="row" sx={{ gap: "16px" }}>
                        <DateTimeField
                          label="Incident start"
                          variant="filled"
                          //defaultValue={new Date()}
                          value={
                            incident.incident_start
                              ? new Date(incident.incident_start)
                              : null
                          }
                          onChange={(newValue) =>
                            setIncident({
                              ...incident,
                              incident_start: newValue,
                            })
                          }
                          sx={{ width: "100%" }}
                        />
                        <DateTimeField
                          label="Incident end"
                          variant="filled"
                          //defaultValue={new Date()}
                          value={
                            incident.incident_end
                              ? new Date(incident.incident_end)
                              : null
                          }
                          onChange={(newValue) =>
                            setIncident({
                              ...incident,
                              incident_end: newValue,
                            })
                          }
                          sx={{ width: "100%" }}
                        />
                      </Stack>
                      <TextField
                        label="Description"
                        name="incidentDescription"
                        value={incident.description}
                        onChange={(e) =>
                          setIncident({
                            ...incident,
                            description: e.target.value,
                          })
                        }
                        fullWidth
                        multiline
                        rows={6}
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
                      />
                      <TextField
                        label="Note"
                        name="incidentNote"
                        value={incident.note}
                        onChange={(e) =>
                          setIncident({ ...incident, note: e.target.value })
                        }
                        fullWidth
                        multiline
                        rows={6}
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
                      />
                      <Typography
                        sx={{
                          fontFamily: "Plus Jakarta Sans, sans-serif",
                          fontSize: "18px",
                          fontWeight: 700,
                          marginTop: "24px",
                          cursor: "default",
                        }}
                      >
                        Incident status
                      </Typography>
                      <Stack direction="row" sx={{ gap: "8px" }}>
                        {[
                          { label: "OPEN", value: 1 },
                          { label: "IN PROGRESS", value: 2 },
                          { label: "RESOLVED", value: 3 },
                        ].map(({ label, value }) => (
                          <StatusButton
                            key={value}
                            onClick={() =>
                              setIncident({ ...incident, status: value })
                            }
                            sx={{
                              backgroundColor:
                                incident.status === value
                                  ? "#d2cfe2"
                                  : "transparent",
                            }}
                          >
                            {label}
                          </StatusButton>
                        ))}
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
                        Save changes
                      </Button>
                    </Box>
                  </form>
                </LocalizationProvider>
              )}
            </div>
          </div>
        </div>
      </section>
      <Snackbar
        open={showError}
        message="Fill all required fields."
        autoHideDuration={4000}
      />
      <ConfirmationModal
        open={successModal}
        onClose={handleClose}
        onConfirm={handleClose}
        confirmText="Incident updated successfully."
        confirmTitle="Incident updated"
        buttonText="Confirm"
      />
    </>
  );
};
export default EditIncidentPage;
