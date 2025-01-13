import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";

import styled from "@emotion/styled";
import { Box, Button, Snackbar, Stack, Typography } from "@mui/material";
import ArrowLeftIcon from "../../assets/icons/arrow-left.svg";
import ChevronUp from "../../assets/icons/arrow-up-right.svg";

import AddContactModal from "./AddContactModal";
import { formatDateWithClock } from "../../helpers/formatDateWithClock";

const WebsiteDetails = styled(Stack)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "24px",
  marginBottom: "40px",
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
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [websiteName, setWebsiteName] = useState<string>("");
  const [websiteUrl, setWebsiteUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const [openContactModal, setOpenContactModal] = useState(false);
  const [modalModeEdit, setModalModeEdit] = useState<boolean>(false);
  const [userExistsError, setUserExistsError] = useState<boolean>(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [contactName, setContactName] = useState("");
  const [contactSurname, setContactSurname] = useState("");
  const [contactEmail, setContactEmail] = useState("");

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

    const fetchContacts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${backendUrl}/api/contacts/website/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

                      "&:hover": {
                        opacity: "0.9",
                      },
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
                        <th>First name</th>
                        <th>Last name</th>
                        <th>Email</th>
                        <th>Created at</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.length > 0 ? (
                        contacts.map((contact: any) => (
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
                          <td colSpan={6} style={{ textAlign: "center" }}>
                            No contacts found with the query
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
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
    </>
  );
};

export default WebsiteDetailsPage;
