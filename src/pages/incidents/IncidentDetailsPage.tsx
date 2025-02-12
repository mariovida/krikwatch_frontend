/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";

import styled from "@emotion/styled";
import { Box, Button, Card, Stack, Typography } from "@mui/material";
import ArrowLeftIcon from "../../assets/icons/arrow-left.svg";
import SendMailModal from "./SendMailModal";
import ViewMailModal from "./ViewMailModal";

import ChevronLeftIcon from "../../assets/icons/ChevronLeft";
import ChevronRightIcon from "../../assets/icons/ChevronRight";

import { formatDateWithClock } from "../../helpers/formatDateWithClock";

const IncidentDetails = styled(Stack)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "40px",
  marginBottom: "40px",
  cursor: "default",
});

const CustomCard = styled(Card)({
  padding: "24px",
  borderRadius: "10px",
  boxShadow:
    "rgba(0, 0, 0, 0.04) 0px 5px 22px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
});

const IncidentDetailsPage = () => {
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (import.meta.env.VITE_ENV === "production") {
    backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  }

  const navigate = useNavigate();
  const { id } = useParams();
  const [incident, setIncident] = useState<any>(null);
  const [contacts, setContacts] = useState<any>(null);
  const [messages, setMessages] = useState<any>(null);
  const [messageId, setMessageId] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [openEmailModal, setOpenEmailModal] = useState(false);
  const [openViewMailModal, setOpenViewMailModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 3;
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  let currentMessages;
  let totalPages = 1;
  if (messages) {
    currentMessages = messages.slice(indexOfFirstClient, indexOfLastClient);
    totalPages = Math.ceil(messages.length / clientsPerPage);
  }

  const handleNextMessagePage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePrevMessagePage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const goToMessagePage = (page: number) => {
    setCurrentPage(page);
  };

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
          setContacts(response.data.contacts);
          setMessages(response.data.messages);
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

  const handleOpenEmailModal = () => {
    setOpenEmailModal(true);
  };

  const handleViewMessage = (messageId: number) => {
    setMessageId(messageId);
    setOpenViewMailModal(true);
  };

  const handleClose = () => {
    navigate(`/incidents`);
  };

  const handleSuccess = () => {
    window.location.reload();
  };

  return (
    <>
      <Helmet>
        <title>Incident details | Krik Monitoring</title>
      </Helmet>

      <section style={{ paddingBottom: "80px" }}>
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
                        position: "relative",
                        fontFamily: "Plus Jakarta Sans, sans-serif",
                        fontSize: "15px",
                        lineHeight: "20px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        color: "#7e7e7e",
                        paddingLeft: "32px",

                        "&::before": {
                          display: "block",
                          content: `""`,
                          height: "2px",
                          width: "24px",
                          position: "absolute",
                          top: "50%",
                          left: 0,
                          backgroundColor: "#7e7e7e",
                        },
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
                    {/* <Box>
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
                          {incident.updated_at
                            ? formatDateWithClock(incident.updated_at)
                            : "-"}
                        </span>
                      </Typography>
                    </Box> */}
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
                  <CustomCard>
                    {incident.description && (
                      <Box sx={{ marginBottom: "32px" }}>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "#7e7e7e",
                            marginBottom: "8px",
                          }}
                        >
                          DESCRIPTION
                        </Typography>
                        <Typography sx={{ whiteSpace: "pre-wrap" }}>
                          {incident.description}
                        </Typography>
                      </Box>
                    )}
                    {incident.note && (
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "#7e7e7e",
                            marginBottom: "8px",
                          }}
                        >
                          NOTE
                        </Typography>
                        <Typography sx={{ whiteSpace: "pre-wrap" }}>
                          {incident.note}
                        </Typography>
                      </Box>
                    )}
                  </CustomCard>
                </>
              )}
            </div>
            <div className="col-12">
              <Stack
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: "48px",
                  marginBottom: "24px",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    lineHeight: "40px !important",
                  }}
                >
                  Messages
                </Typography>
                <Button
                  onClick={handleOpenEmailModal}
                  sx={{
                    flex: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    color: "#ffffff",
                    fontSize: "15px",
                    fontWeight: 600,
                    lineHeight: "40px",
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
                  Send new
                </Button>
              </Stack>
            </div>
            <div className="col-12">
              {messages && messages.length > 0 ? (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(340px, 1fr))",
                    gap: "24px",
                  }}
                >
                  {currentMessages.map((message: any) => (
                    <Box
                      className="custom-box"
                      key={
                        message.id || `${message.sent_to}-${message.sent_at}`
                      }
                    >
                      <div className="clients-list_box">
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "14px",
                              fontWeight: 700,
                              color: "#7e7e7e",
                            }}
                          >
                            SENT AT
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: "Plus Jakarta Sans, sans-serif",
                              fontSize: "15px",
                              lineHeight: "17px",
                              fontWeight: 400,
                              color: "#1b2431",
                              cursor: "default",
                            }}
                          >
                            {formatDateWithClock(message.sent_at)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            marginTop: "24px",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "14px",
                              fontWeight: 700,
                              color: "#7e7e7e",
                            }}
                          >
                            RECIPIENT
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: "Plus Jakarta Sans, sans-serif",
                              fontSize: "16px",
                              lineHeight: "21px",
                              fontWeight: 600,
                              color: "#1b2431",
                              cursor: "default",
                            }}
                          >
                            {message.first_name + " " + message.last_name}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: "Plus Jakarta Sans, sans-serif",
                              fontSize: "15px",
                              lineHeight: "20px",
                              fontWeight: 400,
                              color: "#1b2431",
                              cursor: "default",
                            }}
                          >
                            {message.sent_to}
                          </Typography>
                        </Box>
                        <Box sx={{ marginTop: "24px" }}>
                          <Button
                            onClick={() => handleViewMessage(message.id)}
                            sx={{
                              flex: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              float: "right",
                              color: "#1b2431",
                              fontSize: "14px",
                              fontWeight: 600,
                              lineHeight: "36px",
                              textDecoration: "none",
                              textTransform: "none",
                              backgroundColor: "transparent",
                              padding: "0 16px",
                              border: "1px solid #1b2431",
                              borderRadius: "6px",
                              boxShadow: "none",
                              transition: "0.3s",
                              cursor: "pointer",

                              "&:hover": {
                                color: "#ffffff",
                                backgroundColor: "#1b2431",
                              },
                            }}
                          >
                            VIEW MESSAGE
                          </Button>
                        </Box>
                      </div>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box
                  sx={{
                    padding: "32px 16px",
                    border: "1px dashed #1b2431",
                    borderRadius: "6px",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 500,
                      lineHeight: "21px",
                    }}
                  >
                    No messages sent yet.
                  </Typography>
                </Box>
              )}
            </div>
            {messages && messages.length > 0 && (
              <div className="pagination">
                <button
                  className="pagination-prev"
                  onClick={handlePrevMessagePage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeftIcon />
                </button>
                {[...Array(totalPages).keys()].map((page) => (
                  <button
                    key={page}
                    onClick={() => goToMessagePage(page + 1)}
                    className={currentPage === page + 1 ? "active" : ""}
                  >
                    {page + 1}
                  </button>
                ))}
                <button
                  className="pagination-next"
                  onClick={handleNextMessagePage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRightIcon />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      <SendMailModal
        open={openEmailModal}
        onClose={() => setOpenEmailModal(false)}
        onSuccess={() => {
          handleSuccess();
        }}
        contactsData={contacts}
        incidentData={incident}
      />
      <ViewMailModal
        open={openViewMailModal}
        onClose={() => setOpenViewMailModal(false)}
        messageId={messageId}
      />
    </>
  );
};

export default IncidentDetailsPage;
