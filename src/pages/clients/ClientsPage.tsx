/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";

import AddClientModal from "./AddClientModal";
import ConfirmationDeleteModal from "../../blocks/ConfirmDeleteModal";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MoreMenuIcon from "../../assets/icons/more-menu.svg";

const ClientsPage = () => {
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (import.meta.env.VITE_ENV === "production") {
    backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  }

  const [clients, setClients] = useState<any[]>([]);
  const [filteredClients, setFilteredClients] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openModal, setOpenModal] = useState(false);
  const [clientExistsError, setClientExistsError] = useState<boolean>(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [modalModeEdit, setModalModeEdit] = useState<boolean>(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const [name, setName] = useState("");

  const open = Boolean(anchorEl);

  useEffect(() => {
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
        setFilteredClients(response.data.clients);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [backendUrl]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = clients.filter((client) => {
      return client.name.toLowerCase().includes(query);
    });

    setFilteredClients(filtered);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    client: any
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedClient(client);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    //setSelectedClient(null);
  };

  const handleOpenModal = () => {
    setModalModeEdit(false);
    setSelectedClient(null);
    setOpenModal(true);
  };
  const handleCloseModal = () => setOpenModal(false);
  const handleSnackbarClose = () => setClientExistsError(false);

  const handleCreateClient = async () => {
    const newClient = {
      name: name,
    };

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${backendUrl}/api/clients`,
        newClient,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response && response.data) {
        if (
          response.data.message &&
          response.data.message === "Client with this name already exists"
        ) {
          setClientExistsError(true);
        }
      }

      if (response.status === 201) {
        setClients((prevClients) => [...prevClients, response.data.user]);
        setOpenModal(false);
        setName("");

        window.location.reload();
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleUpdateClient = async () => {
    const updatedClient = {
      name: name,
    };

    if (selectedClient) {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.put(
          `${backendUrl}/api/clients/${selectedClient.id}`,
          updatedClient,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          /*setClients((prevClients) =>
            prevClients.map((client) =>
              client.id === selectedClient.id ? response.data.clients : client
            )
          );*/
          setOpenModal(false);
          setSelectedClient(null);
          setName("");

          window.location.reload();
        }
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  const handleEditUser = (client: React.SetStateAction<null>) => {
    setSelectedClient(client);
    setModalModeEdit(true);
    setOpenModal(true);
  };

  const handleDeleteClient = (client: React.SetStateAction<null>) => {
    setSelectedClient(client);
    setOpenConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (selectedClient) {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.delete(
          `${backendUrl}/api/clients/delete-client/${selectedClient.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          window.location.reload();
        }
      } catch (error) {
        console.error("Error deleting website:", error);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Clients | KrikWatch</title>
      </Helmet>

      {clients && !loading && (
        <>
          <section className="search-container">
            <div className="wrapper">
              <div className="row">
                <div className="col-12">
                  <div className="search-container_box">
                    <input
                      type="text"
                      placeholder="Search clients"
                      value={searchQuery}
                      onChange={handleSearch}
                    />
                    <a className="create-btn" onClick={handleOpenModal}>
                      Add new
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="clients-list">
            <div className="wrapper">
              <div className="row">
                {clients.length > 0 ? (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, minmax(200px, 1fr))",
                      gap: "24px",
                    }}
                  >
                    {filteredClients.map((client) => (
                      <Box className="custom-box" key={client.id}>
                        <div className="clients-list_box">
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                fontFamily: "Plus Jakarta Sans, sans-serif",
                                fontSize: "18px",
                                fontWeight: 700,
                                letterSpacing: "0.5px",
                                color: "#1b2431",
                                cursor: "default",
                              }}
                            >
                              {client.name}
                            </Typography>
                            <IconButton
                              aria-label="more"
                              id={`menu-button-${client.id}`}
                              aria-controls={`menu-${client.id}`}
                              aria-haspopup="true"
                              onClick={(e) => handleMenuOpen(e, client)}
                              sx={{ padding: "4px" }}
                            >
                              <img src={MoreMenuIcon} />
                            </IconButton>
                          </Box>
                          <Typography
                            sx={{ color: "#495057", cursor: "default" }}
                          >
                            {client.website_count}{" "}
                            {client.website_count === 1
                              ? "website"
                              : "websites"}
                          </Typography>
                        </div>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <div className="col-12">
                    <p>No clients found.</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            MenuListProps={{
              "aria-labelledby": "long-button",
            }}
            className="custom-more-menu"
          >
            <MenuItem
              onClick={() => {
                handleEditUser(selectedClient);
                handleMenuClose();
              }}
            >
              Edit client
            </MenuItem>
            {selectedClient?.website_count < 1 && (
              <MenuItem
                className="more-menu-red"
                onClick={() => {
                  handleDeleteClient(selectedClient);
                  handleMenuClose();
                }}
              >
                Delete client
              </MenuItem>
            )}
          </Menu>

          <AddClientModal
            open={openModal}
            onClose={handleCloseModal}
            onSubmit={modalModeEdit ? handleUpdateClient : handleCreateClient}
            editMode={modalModeEdit}
            client={selectedClient}
            name={name}
            setName={setName}
          />
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            open={clientExistsError}
            onClose={handleSnackbarClose}
            message="Client with this name already exists."
            className="snackbar snackbar-error"
            autoHideDuration={4000}
          />
          <ConfirmationDeleteModal
            open={openConfirmModal}
            onClose={() => setOpenConfirmModal(false)}
            onConfirm={confirmDelete}
            confirmText="Are you sure you want to delete this client?"
            confirmTitle="Confirm delete"
          />
        </>
      )}
    </>
  );
};

export default ClientsPage;
