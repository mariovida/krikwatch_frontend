/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import ArrowLeftIcon from "../../assets/icons/arrow-left.svg";

import ConfirmationDeleteModal from "../../blocks/ConfirmDeleteModal";
import { formatDateWithClock } from "../../helpers/formatDateWithClock";

const EditWebsitePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (import.meta.env.VITE_ENV === "production") {
    backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  }

  const [website, setWebsite] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [websiteName, setWebsiteName] = useState<string>("");
  const [websiteUrl, setWebsiteUrl] = useState<string>("");

  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWebsite = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${backendUrl}/api/websites/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response) {
          setWebsite(response.data.website);
          setWebsiteName(response.data.website.name);
          setWebsiteUrl(response.data.website.website_url);
          setSelectedClient(response.data.website.client_id);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${backendUrl}/api/clients`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClients(response.data.clients);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    if (id) {
      fetchWebsite();
      fetchClients();
    }
  }, [backendUrl, id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!websiteName || !selectedClient) {
      setShowError(true);
      return;
    }

    const updatedWebsite = {
      name: websiteName,
      website_url: websiteUrl,
      client_id: selectedClient,
    };

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${backendUrl}/api/websites/${id}`,
        updatedWebsite,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        navigate(`/websites`);
      }
    } catch (error) {
      console.error("Error updating website:", error);
    }
  };

  const handleClose = () => {
    navigate(`/websites`);
  };

  const handleDelete = async () => {
    setOpenConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.delete(`${backendUrl}/api/websites/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        navigate(`/websites`);
      }
    } catch (error) {
      console.error("Error deleting website:", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>{website ? website.name : "Edit website"} | KrikWatch</title>
      </Helmet>

      <section>
        <div className="wrapper">
          <div className="row">
            <div className="col-12">
              <Button className="go-back-btn" onClick={handleClose}>
                <img src={ArrowLeftIcon} />
                All websites
              </Button>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  marginBottom: "24px",
                }}
              >
                Edit website
              </Typography>
              <form onSubmit={handleSubmit} className="custom-form">
                <Box className="form-fields" sx={{ marginTop: "0 !important" }}>
                  <TextField
                    label="Website Name"
                    name="websiteName"
                    value={websiteName}
                    onChange={(e) => setWebsiteName(e.target.value)}
                    fullWidth
                    variant="filled"
                    required
                  />
                  <TextField
                    label="Website URL"
                    name="websiteUrl"
                    value={websiteUrl || ""}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    fullWidth
                    variant="filled"
                    required
                  />
                  <FormControl fullWidth variant="filled" required>
                    <InputLabel id="client-select-label">
                      Select Client
                    </InputLabel>
                    <Select
                      labelId="client-select-label"
                      value={selectedClient}
                      onChange={(e) => setSelectedClient(e.target.value)}
                      label="Select Client"
                    >
                      <MenuItem value="" disabled>
                        Select Client
                      </MenuItem>
                      {clients.map((client) => (
                        <MenuItem key={client.id} value={client.id}>
                          {client.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box
                  className="action-btns"
                  sx={{
                    justifyContent: "space-between !important",
                    alignItems: "center",
                  }}
                >
                  <Button onClick={handleDelete} className="delete-btn">
                    Delete website
                  </Button>
                  <div className="action-btns">
                    <Button onClick={handleClose} className="cancel-btn">
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="submit-btn"
                      disabled={loading}
                    >
                      Save changes
                    </Button>
                  </div>
                </Box>
              </form>
            </div>
          </div>
        </div>
      </section>

      <ConfirmationDeleteModal
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        onConfirm={confirmDelete}
        confirmText="Are you sure you want to delete this website?"
        confirmTitle="Confirm delete"
      />
    </>
  );
};

export default EditWebsitePage;
