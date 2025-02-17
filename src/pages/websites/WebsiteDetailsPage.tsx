/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";

import styled from "@emotion/styled";
import {
  Box,
  Button,
  Snackbar,
  Stack,
  IconButton,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import ArrowLeftIcon from "../../assets/icons/arrow-left.svg";
import ChevronUp from "../../assets/icons/arrow-up-right.svg";
import EyeIcon from "../../assets/icons/eye.svg";
import ChevronLeftIcon from "../../assets/icons/ChevronLeft";
import ChevronRightIcon from "../../assets/icons/ChevronRight";
import MoreMenuIcon from "../../assets/icons/more-menu.svg";

import AddContactModal from "./AddContactModal";
import { formatDateWithClock } from "../../helpers/formatDateWithClock";
import ConfirmationDeleteModal from "../../blocks/ConfirmDeleteModal";

const WebsiteDetails = styled(Stack)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "40px",
  marginBottom: "40px",
  cursor: "default",
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
  const [contacts, setContacts] = useState<any>(null);
  const [incidents, setIncidents] = useState<any>(null);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [websiteName, setWebsiteName] = useState<string>("");
  const [websiteUrl, setWebsiteUrl] = useState<string>("");
  const [screenshot, setScreenshot] = useState(null);
  const [faviconUrl, setFaviconUrl] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [openContactModal, setOpenContactModal] = useState(false);
  const [modalModeEdit, setModalModeEdit] = useState<boolean>(false);
  const [userExistsError, setUserExistsError] = useState<boolean>(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [contactName, setContactName] = useState("");
  const [contactSurname, setContactSurname] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [currentContactPage, setCurrentContactPage] = useState(1);
  const [contactItemsPerPage] = useState(5);
  let totalPages = 0;
  let totalContactPages = 0;
  if (incidents) {
    totalPages = Math.ceil(incidents.length / itemsPerPage);
  }
  if (contacts) {
    totalContactPages = Math.ceil(contacts.length / contactItemsPerPage);
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [deleteWebsite, setDeleteWebsite] = useState<any>(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  useEffect(() => {
    const fetchWebsite = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${backendUrl}/api/websites/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response) {
          setWebsite(response.data.website);
          setWebsiteName(response.data.website.name);
          setWebsiteUrl(response.data.website.website_url);
          setIncidents(response.data.incidents);
          setFaviconUrl(response.data.website.favicon);
          /*const faviconUrl = `https://icons.duckduckgo.com/ip3/${new URL(response.data.website.website_url).hostname}.ico`;
          setFaviconUrl(faviconUrl);
          const checkFavicon = await fetch(faviconUrl, { method: "HEAD" });
          setFaviconUrl(checkFavicon.ok ? faviconUrl : null);*/
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
          headers: { Authorization: `Bearer ${token}` },
        });
        setClients(response.data.clients);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchContacts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${backendUrl}/api/contacts/website/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setContacts(response.data.contacts);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchWebsite();
      fetchClients();
      fetchContacts();
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

  /*
  useEffect(() => {
    const getchScreenshot = async () => {
      const screenshotResponse = await axios.get(
        `${backendUrl}/api/websites/screenshot?url=${encodeURIComponent(websiteUrl)}`
      );

      if (screenshotResponse.data.imageUrl) {
        console.log(screenshotResponse.data.imageUrl);
      }
    };

    if (websiteUrl) {
      getchScreenshot();
    }
  }, [websiteUrl]);
  */

  let currentIncidents;
  let currentContacts;
  if (incidents) {
    currentIncidents = incidents.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }
  if (contacts) {
    currentContacts = contacts.slice(
      (currentContactPage - 1) * contactItemsPerPage,
      currentContactPage * contactItemsPerPage
    );
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };
  const goToNextPageContacts = () => {
    if (currentContactPage < totalContactPages)
      setCurrentContactPage(currentContactPage + 1);
  };
  const goToPreviousPageContacts = () => {
    if (currentContactPage > 1) setCurrentContactPage(currentContactPage - 1);
  };
  const goToPageContacts = (page: number) => {
    setCurrentContactPage(page);
  };

  const handleCreateContact = async () => {
    const newContact = {
      first_name: contactName,
      last_name: contactSurname,
      email: contactEmail,
      website_id: id,
    };

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${backendUrl}/api/contacts`,
        newContact,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response && response.data) {
        if (
          response.data.message &&
          response.data.message ===
            "Contact with this email address already exists"
        ) {
          setUserExistsError(true);
        }
      }
      if (response.status === 201) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error adding contact:", error);
      alert("Error adding contact.");
    }
  };

  const handleUpdateContact = async () => {
    const updatedContact = {
      first_name: contactName,
      last_name: contactSurname,
      email: contactEmail,
    };

    if (selectedContact) {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.put(
          `${backendUrl}/api/contacts/${selectedContact.id}`,
          updatedContact,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setContacts((prevContacts: any) =>
            prevContacts.map((contact: any) =>
              contact.id === selectedContact.id
                ? response.data.contact
                : contact
            )
          );
          setOpenContactModal(false);
          setSelectedContact(null);
          setContactName("");
          setContactSurname("");
          setContactEmail("");

          window.location.reload();
        }
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  const handleOpenContactModal = () => {
    setModalModeEdit(false);
    setOpenContactModal(true);
  };
  const handleCloseModal = () => setOpenContactModal(false);
  const handleSnackbarClose = () => setUserExistsError(false);

  const handleEditUser = (user: React.SetStateAction<null>) => {
    setSelectedContact(user);
    setModalModeEdit(true);
    setOpenContactModal(true);
  };

  const handleClose = () => {
    navigate(`/websites`);
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

  const handleDeleteWebsite = (website: React.SetStateAction<null>) => {
    if (website) {
      setDeleteWebsite(website);
    }
    setOpenConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (deleteWebsite) {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.delete(
          `${backendUrl}/api/websites/${deleteWebsite.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
          navigate(`/websites`);
        }
      } catch (error) {
        console.error("Error deleting incident:", error);
      }
    }
  };

  const handleCreateIncident = () => {
    navigate(`/incidents/create-new`);
  };

  const handleDetailsClick = (id: string) => {
    navigate(`/incident/${id}`);
  };

  const handleEditWebsite = (id: string) => {
    navigate(`/website/${id}/edit`);
  };

  return (
    <>
      <Helmet>
        <title>Website details | KrikWatch</title>
      </Helmet>
      {!loading && website && (
        <section style={{ paddingBottom: "120px" }}>
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
                  <Stack
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    {faviconUrl && (
                      <Box sx={{ width: "38px", height: "38px" }}>
                        <img
                          src={`data:image/png;base64,${faviconUrl}`}
                          alt="Website favicon"
                          style={{
                            width: "38px",
                            height: "38px",
                            objectFit: "contain",
                          }}
                        />
                      </Box>
                    )}
                    <Typography
                      variant="h3"
                      sx={{
                        fontFamily: "Plus Jakarta Sans, sans-serif",
                        textTransform: "uppercase",
                      }}
                    >
                      {websiteName}
                    </Typography>
                  </Stack>
                  <Box>
                    {websiteUrl !== "" && (
                      <Button
                        onClick={() => window.open(websiteUrl, "_blank")}
                        sx={{
                          height: "40px",
                          flex: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          color: "#1b2431",
                          fontSize: "15px",
                          fontWeight: 600,
                          textDecoration: "none",
                          textTransform: "none",
                          backgroundColor: "#f2f2f2",
                          padding: "0 12px",
                          border: "1px solid #1b2431",
                          borderRadius: "6px",
                          boxShadow:
                            "rgba(0, 0, 0, 0.04) 0px 5px 22px 0px,rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
                          transition: "0.2s",
                          cursor: "pointer",
                        }}
                      >
                        Visit website
                      </Button>
                    )}
                    <IconButton
                      aria-label="more"
                      id={`menu-button-${website.id}`}
                      aria-controls={`menu-${website.id}`}
                      aria-haspopup="true"
                      onClick={(e) => handleMenuOpen(e, website)}
                      sx={{ marginLeft: "12px", padding: "4px" }}
                    >
                      <img src={MoreMenuIcon} />
                    </IconButton>
                  </Box>
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
                  {/* <Box>
                    {website.status === 1 ? (
                      <span className="status-badge status-badge_active">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="status-badge status-badge_inactive">
                        INACTIVE
                      </span>
                    )}
                  </Box> */}
                  {website.hosting_url && (
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "15px",
                          fontWeight: 400,
                          lineHeight: "24px",
                          color: "#1b2431",
                        }}
                      >
                        Hosting URL:
                        <span style={{ marginLeft: "8px", color: "#7e7e7e" }}>
                          {website.hosting_url}
                        </span>
                      </Typography>
                    </Box>
                  )}
                </WebsiteDetails>
              </div>
              <div className="col-12">
                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
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
                    Incidents
                  </Typography>
                  <Button
                    onClick={handleCreateIncident}
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
                    Create new
                  </Button>
                </Stack>
                {incidents && (
                  <>
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Status</th>
                          <th>Title</th>
                          <th style={{ width: "240px" }}>Author</th>
                          <th style={{ width: "200px" }}>Created at</th>
                          <th style={{ width: "60px" }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {incidents.length > 0 ? (
                          currentIncidents.map((incident: any) => (
                            <tr key={incident.incident_key}>
                              <td>
                                {incident ? (
                                  incident.status === 1 ? (
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
                                  ) : null
                                ) : null}
                              </td>
                              <td>{incident.title}</td>
                              <td>
                                {incident.created_by_first_name +
                                  " " +
                                  incident.created_by_last_name}
                              </td>
                              <td>
                                {formatDateWithClock(incident.created_at)}
                              </td>
                              <td>
                                <button
                                  onClick={() =>
                                    handleDetailsClick(incident.incident_key)
                                  }
                                >
                                  <img src={EyeIcon} />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} style={{ textAlign: "center" }}>
                              There are no incidents for this website yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    {incidents.length > 0 && currentIncidents.length > 0 && (
                      <div className="pagination">
                        <button
                          className="pagination-prev"
                          onClick={goToPreviousPage}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeftIcon />
                        </button>
                        {[...Array(totalPages).keys()].map((page) => (
                          <button
                            key={page}
                            onClick={() => goToPage(page + 1)}
                            className={currentPage === page + 1 ? "active" : ""}
                          >
                            {page + 1}
                          </button>
                        ))}
                        <button
                          className="pagination-next"
                          onClick={goToNextPage}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronRightIcon />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="col-12">
                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: "56px",
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
                    Contacts
                  </Typography>
                  <Button
                    onClick={handleOpenContactModal}
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
                    Add new
                  </Button>
                </Stack>
              </div>
              {contacts && (
                <div className="col-12">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th style={{ minWidth: "240px" }}>First name</th>
                        <th style={{ width: "280px" }}>Last name</th>
                        <th style={{ width: "280px" }}>Email</th>
                        <th>Created at</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.length > 0 ? (
                        currentContacts.map((contact: any) => (
                          <tr key={contact.id}>
                            <td>{contact.first_name}</td>
                            <td>{contact.last_name}</td>
                            <td>{contact.email}</td>
                            <td>{formatDateWithClock(contact.created_at)}</td>
                            <td style={{ width: "100px" }}>
                              <button onClick={() => handleEditUser(contact)}>
                                <img src={ChevronUp} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} style={{ textAlign: "center" }}>
                            There are no contacts added for this website.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {contacts.length > 0 && currentContacts.length > 0 && (
                    <div className="pagination">
                      <button
                        className="pagination-prev"
                        onClick={goToPreviousPageContacts}
                        disabled={currentContactPage === 1}
                      >
                        <ChevronLeftIcon />
                      </button>
                      {[...Array(totalContactPages).keys()].map((page) => (
                        <button
                          key={page}
                          onClick={() => goToPageContacts(page + 1)}
                          className={
                            currentContactPage === page + 1 ? "active" : ""
                          }
                        >
                          {page + 1}
                        </button>
                      ))}
                      <button
                        className="pagination-next"
                        onClick={goToNextPageContacts}
                        disabled={currentContactPage === totalContactPages}
                      >
                        <ChevronRightIcon />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{ "aria-labelledby": "long-button" }}
        className="custom-more-menu"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => handleEditWebsite(website.id)}>
          Edit website
        </MenuItem>
        {incidents && incidents.length < 1 && (
          <MenuItem
            className="more-menu-red"
            onClick={() => {
              handleDeleteWebsite(website);
              handleMenuClose();
            }}
          >
            Delete website
          </MenuItem>
        )}
      </Menu>
      <AddContactModal
        open={openContactModal}
        onClose={handleCloseModal}
        onSubmit={modalModeEdit ? handleUpdateContact : handleCreateContact}
        editMode={modalModeEdit}
        user={selectedContact}
        firstName={contactName}
        lastName={contactSurname}
        email={contactEmail}
        setFirstName={setContactName}
        setLastName={setContactSurname}
        setEmail={setContactEmail}
      />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={userExistsError}
        onClose={handleSnackbarClose}
        message="Contact with this email address already exists."
        className="snackbar snackbar-error"
        autoHideDuration={4000}
      />
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

export default WebsiteDetailsPage;
