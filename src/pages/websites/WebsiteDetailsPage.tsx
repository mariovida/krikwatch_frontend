import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";

import styled from "@emotion/styled";
import { Box, Button, Stack, Typography } from "@mui/material";
import ArrowLeftIcon from "../../assets/icons/arrow-left.svg";

import { formatDateWithClock } from "../../helpers/formatDateWithClock";

const WebsiteDetails = styled(Stack)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "24px",
});

const WebsiteDetailsPage = () => {
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (import.meta.env.VITE_ENV === "production") {
    backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  }

  const navigate = useNavigate();
  const { id } = useParams();
  const [website, setWebsite] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [websiteName, setWebsiteName] = useState<string>("");
  const [websiteUrl, setWebsiteUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  console.log(website);

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
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchClients = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchWebsite();
      fetchClients();
    }
  }, [backendUrl, id]);

  useEffect(() => {
    if (clients && website) {
      const client = clients.find((client) => client.id === website.client_id);
      if (client) {
        setSelectedClient(client.name);
      }
    }
  }, [clients, website]);

  const handleClose = () => {
    navigate(`/websites`);
  };

  return (
    <>
      <Helmet>
        <title>Website details | KrikWatch</title>
      </Helmet>
      {!loading && website && (
        <section>
          <div className="wrapper">
            <div className="row">
              <div className="col-12">
                <Button className="go-back-btn" onClick={handleClose}>
                  <img src={ArrowLeftIcon} />
                  All websites
                </Button>
                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: "24px",
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: "Plus Jakarta Sans, sans-serif",
                      textTransform: "uppercase",
                    }}
                  >
                    {websiteName}
                  </Typography>
                  {websiteUrl !== "" && (
                    <Button
                      onClick={() => window.open(websiteUrl, "_blank")}
                      sx={{
                        flex: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        color: "#ffffff",
                        fontSize: "15px",
                        fontWeight: 600,
                        textDecoration: "none",
                        textTransform: "none",
                        backgroundColor: "#1b2431",
                        padding: "0 16px",
                        borderRadius: "6px",
                        boxShadow:
                          "rgba(0, 0, 0, 0.04) 0px 5px 22px 0px,rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
                        transition: "0.2s",
                        cursor: "pointer",

                        "&:hover": {
                          opacity: "0.9",
                        },
                      }}
                    >
                      Visit website
                    </Button>
                  )}
                </Stack>
                <WebsiteDetails>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "15px",
                        fontWeight: 400,
                        lineHeight: "24px",
                        color: "#1b2431",
                      }}
                    >
                      Created at:
                      <span style={{ marginLeft: "8px", color: "#7e7e7e" }}>
                        {formatDateWithClock(website.created_at)}
                      </span>
                    </Typography>
                  </Box>
                  <Box>
                    {website.status === 1 ? (
                      <span className="status-badge status-badge_active">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="status-badge status-badge_inactive">
                        INACTIVE
                      </span>
                    )}
                  </Box>
                </WebsiteDetails>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default WebsiteDetailsPage;
