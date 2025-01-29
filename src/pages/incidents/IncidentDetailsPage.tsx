/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";

import styled from "@emotion/styled";
import { Box, Button, Snackbar, Stack, Typography } from "@mui/material";
import ArrowLeftIcon from "../../assets/icons/arrow-left.svg";

import { formatDateWithClock } from "../../helpers/formatDateWithClock";

const IncidentDetails = styled(Stack)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "40px",
  marginBottom: "64px",
  cursor: 'default',
});

const IncidentDetailsPage = () => {
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (import.meta.env.VITE_ENV === "production") {
    backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  }

  const navigate = useNavigate();
  const { id } = useParams();
  const [incident, setIncident] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchIncidents = async () => {
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
      fetchIncidents();
    }
  }, [backendUrl, id]);

  const handleClose = () => {
    navigate(`/incidents`);
  };

  return (
    <>
      <Helmet>
        <title>Incident details | KrikWatch</title>
      </Helmet>

      <section>
        <div className="wrapper">
          <div className="row">
            <div className="col-12">
              <Button className="go-back-btn" onClick={handleClose}>
                <img src={ArrowLeftIcon} />
                All incidents
              </Button>
              {incident && (
                <>
                <Stack
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  marginBottom: "8px",
                }}
              >
                <Typography
                  sx={{
                    position: 'relative',
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    fontSize: '15px',
                    lineHeight: '20px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#7e7e7e',
                    paddingLeft: '32px',

                    '&::before': {
                      display: 'block',
                      content: `""`,
                      height: '2px',
                      width: '24px',
                      position: 'absolute',
                      top: '50%',
                      left: 0,
                      backgroundColor: '#7e7e7e',
                    }
                  }}
                >
                  {incident.website_name}
                </Typography>
              </Stack>
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
                  }}
                >
                  {incident.title}
                </Typography>
              </Stack>
              <IncidentDetails>
                 <Box>
                  {incident.status === 1 ? (
                    <span className="status-badge status-badge_open">
                      OPEN
                    </span>
                  ) : incident.status === 2 ? (
                    <span className="status-badge status-badge_progress">
                      IN PROGRESS
                    </span>
                  ) : incident.status === 3 ? (
                    <span className="status-badge status-badge_active">
                      RESOLVED
                    </span>
                  ) : incident.status === 4 ? (
                    <span className="status-badge status-badge_closed">
                      CLOSED
                    </span>
                  ) : null}
                </Box>
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
                      {formatDateWithClock(incident.created_at)}
                    </span>
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: "15px",
                      fontWeight: 400,
                      lineHeight: "24px",
                      color: "#1b2431",
                    }}
                  >
                    Updated at:
                    <span style={{ marginLeft: "8px", color: "#7e7e7e" }}>
                      {incident.updated_at ? formatDateWithClock(incident.updated_at) : '-'}
                    </span>
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: "15px",
                      fontWeight: 400,
                      lineHeight: "24px",
                      color: "#1b2431",
                    }}
                  >
                    Created by:
                    <span style={{ marginLeft: "8px", color: "#7e7e7e" }}>
                      {incident.created_by}
                    </span>
                  </Typography>
                </Box>
              </IncidentDetails>
              <Box sx={{ marginBottom: '32px' }}>
                <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#7e7e7e', marginBottom: '8px' }}>DESCRIPTION</Typography>
                <Typography>{incident.description}</Typography>
              </Box>
              {incident.note && (
                <Box>
                  <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#7e7e7e', marginBottom: '8px' }}>NOTE</Typography>
                  <Typography>{incident.note}</Typography>
                </Box>
              )}
              </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default IncidentDetailsPage;
