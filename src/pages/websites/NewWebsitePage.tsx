/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowLeftIcon from "../../assets/icons/arrow-left.svg";

const NewWebsitePage = () => {
  const navigate = useNavigate();
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (import.meta.env.VITE_ENV === "production") {
    backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  }

  const [clients, setClients] = useState<any[]>([]);
  const [websiteName, setWebsiteName] = useState<string>("");
  const [websiteUrl, setWebsiteUrl] = useState<string>("");
  const [uptimeId, setUptimeId] = useState<string>("");
  const [hostingInfo, setHostingInfo] = useState<string>("");
  const [hostingUrl, setHostingUrl] = useState<string>("");
  const [favicon, setFavicon] = useState<File | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [showError, setShowError] = useState<boolean>(false);
  const [showDuplicateError, setShowDuplicateError] = useState<boolean>(false);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${backendUrl}/api/clients`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClients(response.data.clients);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [backendUrl]);

  const uploadFavicon = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("favicon", file);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${backendUrl}/api/websites/upload-favicon`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 && response.data.fileName) {
        return response.data.fileName;
      } else {
        throw new Error("File upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!websiteName || !selectedClient) {
      setShowError(true);
      return;
    }

    let uploadedFavicon = null;
    if (favicon) {
      uploadedFavicon = await uploadFavicon(favicon);
    }

    const newWebsite = {
      name: websiteName,
      url: websiteUrl,
      client_id: selectedClient,
      uptime_id: uptimeId,
      hosting_url: hostingUrl,
      hosting_info: hostingInfo,
      favicon: uploadedFavicon,
    };

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${backendUrl}/api/websites`,
        newWebsite,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (
        response &&
        response.data &&
        response.data.message &&
        response.data.message === "Website with this name already exists"
      ) {
        setShowDuplicateError(true);
      }

      if (response.status === 201) {
        setWebsiteName("");
        setSelectedClient("");
        handleClose();
      }
    } catch (error) {
      console.error("Error creating website:", error);
      setShowError(true);
    }
  };

  const handleClose = () => {
    navigate(`/websites`);
  };

  const handleSnackbarClose = () => {
    setShowError(false);
    setShowDuplicateError(false);
  };

  return (
    <>
      <Helmet>
        <title>New website | KrikWatch</title>
      </Helmet>

      <section style={{ paddingBottom: "80px" }}>
        <div className="wrapper">
          <div className="row">
            <div className="col-12 col-md-8 offset-md-2">
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
                Create new
              </Typography>
              <form onSubmit={handleSubmit} className="custom-form">
                <Box className="form-fields" sx={{ marginTop: "0 !important" }}>
                  <Typography
                    sx={{
                      fontFamily: "Plus Jakarta Sans, sans-serif",
                      fontSize: "18px",
                      fontWeight: 700,
                      cursor: "default",
                    }}
                  >
                    Website favicon
                  </Typography>
                  {!faviconPreview ? (
                    <Box>
                      <input
                        accept="image/*"
                        id="favicon-upload"
                        type="file"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            setFavicon(file);
                            setFaviconPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                      <label htmlFor="favicon-upload" style={{ width: "100%" }}>
                        <Button
                          component="span"
                          sx={{
                            width: "100%",
                            height: "80px",
                            backgroundColor: "transparent",
                            color: "#7e7e7e",
                            fontFamily: "Plus Jakarta Sans, sans-serif",
                            fontSize: "16px",
                            fontWeight: 400,
                            letterSpacing: 0,
                            textTransform: "none",
                            padding: "0 16px",
                            border: "1px solid #E5E7EB",
                            borderRadius: "8px",
                            "&:hover": { backgroundColor: "#f2f2f2" },
                          }}
                        >
                          Add favicon
                        </Button>
                      </label>
                    </Box>
                  ) : (
                    <>
                      <Button
                        color="error"
                        onClick={() => {
                          setFavicon(null);
                          setFaviconPreview(null);
                        }}
                        sx={{
                          fontSize: "15px",
                          textTransform: "none",
                          fontWeight: 600,
                          letterSpacing: 0,
                          color: "#ffffff",
                          backgroundColor: "#d84141",
                          padding: "6px 8px",
                        }}
                      >
                        Remove
                      </Button>
                      <img
                        src={faviconPreview}
                        alt="Favicon Preview"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "contain",
                        }}
                      />
                    </>
                  )}
                  <Typography
                    sx={{
                      fontFamily: "Plus Jakarta Sans, sans-serif",
                      fontSize: "18px",
                      fontWeight: 700,
                      cursor: "default",
                    }}
                  >
                    Website details
                  </Typography>
                  <TextField
                    label="Website name"
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
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    fullWidth
                    variant="filled"
                  />
                  <Stack direction="row" sx={{ gap: "16px" }}>
                    <FormControl fullWidth variant="filled" required>
                      <InputLabel id="client-select-label">
                        Select client
                      </InputLabel>
                      <Select
                        labelId="client-select-label"
                        value={selectedClient}
                        onChange={(e) => setSelectedClient(e.target.value)}
                        label="Select client"
                      >
                        <MenuItem value="" disabled>
                          Select client
                        </MenuItem>
                        {clients.map((client) => (
                          <MenuItem key={client.id} value={client.id}>
                            {client.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      label="Uptime ID"
                      name="uptimeId"
                      value={uptimeId}
                      onChange={(e) => setUptimeId(e.target.value)}
                      fullWidth
                      variant="filled"
                    />
                  </Stack>
                  <Typography
                    sx={{
                      fontFamily: "Plus Jakarta Sans, sans-serif",
                      fontSize: "18px",
                      fontWeight: 700,
                      cursor: "default",
                    }}
                  >
                    Hosting details
                  </Typography>
                  <TextField
                    label="Hosting URL"
                    name="hostingUrl"
                    value={hostingUrl}
                    onChange={(e) => setHostingUrl(e.target.value)}
                    fullWidth
                    variant="filled"
                  />
                  <TextField
                    label="Other"
                    name="hostingInfo"
                    value={hostingInfo}
                    onChange={(e) => setHostingInfo(e.target.value)}
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
            </div>
          </div>
        </div>
      </section>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={showError}
        onClose={handleSnackbarClose}
        message="Fill required fields."
        className="snackbar snackbar-error"
        autoHideDuration={4000}
      />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={showDuplicateError}
        onClose={handleSnackbarClose}
        message="Website with this name already exists."
        className="snackbar snackbar-error"
        autoHideDuration={4000}
      />
    </>
  );
};

export default NewWebsitePage;
