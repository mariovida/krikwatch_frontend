/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";

import {
  Page,
  Font,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
Font.register({
  family: "Plus Jakarta Sans",
  src: "/PlusJakartaSans-Regular.ttf",
});

import styled from "@emotion/styled";
import {
  Box,
  Button,
  Card,
  IconButton,
  Stack,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import ArrowLeftIcon from "../../assets/icons/arrow-left.svg";
import SendMailModal from "./SendMailModal";
import ViewMailModal from "./ViewMailModal";

import ChevronLeftIcon from "../../assets/icons/ChevronLeft";
import ChevronRightIcon from "../../assets/icons/ChevronRight";
import MoreMenuIcon from "../../assets/icons/more-menu.svg";

import { formatDateWithClock } from "../../helpers/formatDateWithClock";
import ConfirmationDeleteModal from "../../blocks/ConfirmDeleteModal";

const styles = StyleSheet.create({
  page: { fontFamily: "Plus Jakarta Sans", padding: "16px 12px" },
  header: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  normal: { fontSize: 10 },
  tiny: {
    fontSize: 6,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#7e7e7e",
  },
});

const MyDocument = ({ incident }: { incident: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={{ padding: "0" }}>
        <Text style={styles.tiny}>{incident.website_name}</Text>
      </View>
      <Text style={styles.header}>{incident.title}</Text>
      <View style={{ padding: "0", marginBottom: "12px" }}>
        <Text style={styles.tiny}>Created by</Text>
        <Text style={styles.normal}>{incident.created_by}</Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "0",
          marginBottom: "12px",
        }}
      >
        <View>
          <Text style={styles.tiny}>Start Time</Text>
          <Text style={styles.normal}>
            {formatDateWithClock(incident.incident_start)}
          </Text>
        </View>
        <View>
          <Text style={styles.tiny}>End Time</Text>
          <Text style={styles.normal}>
            {formatDateWithClock(incident.incident_end) || "-"}
          </Text>
        </View>
      </View>
      <View
        style={{
          padding: "8px",
          border: "1px solid black",
          borderRadius: "10px",
          marginBottom: "12px",
        }}
      >
        <Text style={styles.tiny}>Description</Text>
        <Text style={styles.normal}>{incident.description || "-"}</Text>
      </View>
      <View
        style={{
          padding: "8px",
          border: "1px solid black",
          borderRadius: "10px",
        }}
      >
        <Text style={styles.tiny}>Note</Text>
        <Text style={styles.normal}>{incident.note || "-"}</Text>
      </View>
    </Page>
  </Document>
);

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
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response) {
          setIncident(response.data.incident);
          setContacts(response.data.contacts);
          setMessages(response.data.messages);
        }
      } catch (error) {
        navigate(`/incidents`);
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

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    incident: any
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteIncident = (incident: React.SetStateAction<null>) => {
    setOpenConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (incident) {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.delete(
          `${backendUrl}/api/incidents/delete-incident/${incident.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
          navigate(`/incidents`);
        }
      } catch (error) {
        console.error("Error deleting incident:", error);
      }
    }
  };

  const handleClose = () => {
    navigate(`/incidents`);
  };

  const handleSuccess = () => {
    window.location.reload();
  };

  const handleEditIncident = (id: string) => {
    navigate(`/incident/${id}/edit`);
  };

  return (
    <>
      <Helmet>
        <title>Incident details | KrikWatch</title>
      </Helmet>
      {incident && (
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
                        sx={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                      >
                        {incident.title}
                      </Typography>
                      <Box>
                        <PDFDownloadLink
                          document={<MyDocument incident={incident} />}
                          fileName={`incident_${incident.title.replace(/\s+/g, "_")}_${incident.incident_key}.pdf`}
                        >
                          {() => (
                            <Button
                              sx={{
                                height: "40px",
                                flex: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                color: "#f5f5f5",
                                fontSize: "15px",
                                fontWeight: 600,
                                textDecoration: "none",
                                textTransform: "none",
                                backgroundColor: "#1b2431",
                                padding: "0 16px",
                                border: "1px solid #1b2431",
                                borderRadius: "6px",
                                boxShadow: "none",
                                transition: "0.2s",
                                cursor: "pointer",

                                "&:hover": { opacity: "0.9" },
                              }}
                            >
                              Download
                            </Button>
                          )}
                        </PDFDownloadLink>
                        <IconButton
                          aria-label="more"
                          id={`menu-button-${incident.id}`}
                          aria-controls={`menu-${incident.id}`}
                          aria-haspopup="true"
                          onClick={(e) => handleMenuOpen(e, incident)}
                          sx={{ marginLeft: "12px", padding: "4px" }}
                        >
                          <img src={MoreMenuIcon} />
                        </IconButton>
                      </Box>
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
                    {incident.description && (
                      <CustomCard>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "#7e7e7e",
                            marginBottom: "24px",
                          }}
                        >
                          DESCRIPTION
                        </Typography>
                        <Typography sx={{ whiteSpace: "pre-wrap" }}>
                          {incident.description}
                        </Typography>
                      </CustomCard>
                    )}
                    {incident.note && (
                      <CustomCard sx={{ marginTop: "32px" }}>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "#7e7e7e",
                            marginBottom: "24px",
                          }}
                        >
                          NOTE
                        </Typography>
                        <Typography sx={{ whiteSpace: "pre-wrap" }}>
                          {incident.note}
                        </Typography>
                      </CustomCard>
                    )}
                  </>
                )}
              </div>
              {/* {incident && incident.description && (<>
              <div className="col-12 col-md-2">
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
            </div>
            <div className="col-12 col-md-10">
              <Typography sx={{ whiteSpace: "pre-wrap" }}>
                {incident.description}
              </Typography>
            </div></>
            )}
            {incident && incident.note && (<>
            <div className="col-12"  style={{  marginTop: '40px' }}></div>
              <div className="col-12 col-md-2">
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
            </div>
            <div className="col-12 col-md-10">
              <Typography sx={{ whiteSpace: "pre-wrap" }}>
                {incident.note}
              </Typography>
            </div></>
            )} */}
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

                      "&:hover": { opacity: "0.9" },
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
      )}
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
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{ "aria-labelledby": "long-button" }}
        className="custom-more-menu"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => handleEditIncident(incident.incident_key)}>
          Edit incident
        </MenuItem>
        <MenuItem
          className="more-menu-red"
          onClick={() => {
            handleDeleteIncident(incident);
            handleMenuClose();
          }}
        >
          Delete incident
        </MenuItem>
      </Menu>
      <ConfirmationDeleteModal
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        onConfirm={confirmDelete}
        confirmText="Are you sure you want to delete this incident?"
        confirmTitle="Confirm delete"
      />
    </>
  );
};

export default IncidentDetailsPage;
