/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";

import { Box, Menu, MenuItem, IconButton } from "@mui/material";

import EditIcon from "../../assets/icons/edit2.svg";
import EyeIcon from "../../assets/icons/eye.svg";
import ChevronLeftIcon from "../../assets/icons/ChevronLeft";
import ChevronRightIcon from "../../assets/icons/ChevronRight";
import MoreMenuIcon from "../../assets/icons/more-menu.svg";

import { formatDateWithClock } from "../../helpers/formatDateWithClock";
import ConfirmationDeleteModal from "../../blocks/ConfirmDeleteModal";

const WebsitesPage = () => {
  const navigate = useNavigate();
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (import.meta.env.VITE_ENV === "production") {
    backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  }

  const [websites, setWebsites] = useState<any[]>([]);
  const [filteredWebsites, setFilteredWebsites] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const totalPages = Math.ceil(filteredWebsites.length / itemsPerPage);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedWebsite, setSelectedWebsite] = useState<any>(null);
  const [deleteWebsite, setDeleteWebsite] = useState<any>(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchWebsites = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${backendUrl}/api/websites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sortedWebsites = response.data.websites.sort((a: any, b: any) => {
          return a.name.localeCompare(b.name, "hr", { sensitivity: "base" });
        });
        setWebsites(response.data.websites);
        setFilteredWebsites(sortedWebsites);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWebsites();
  }, [backendUrl]);

  const currentWebsites = filteredWebsites.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setCurrentPage(1);

    const filtered = websites.filter((website) => {
      return (
        website.name.toLowerCase().includes(query) ||
        website.client_name.toLowerCase().includes(query)
      );
    });

    setFilteredWebsites(filtered);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    website: any
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedWebsite(website);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedWebsite(null);
  };

  const handleAddNewButton = () => {
    navigate(`/websites/create-new`);
  };

  const handleEditClick = (id: string) => {
    navigate(`/website/${id}/edit`);
  };

  const handleDetailsClick = (id: string) => {
    navigate(`/website/${id}`);
  };

  const handleDeleteWebsite = (incident: React.SetStateAction<null>) => {
    if (incident) {
      setDeleteWebsite(incident);
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
          window.location.reload();
        }
      } catch (error) {
        console.error("Error deleting incident:", error);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Websites | KrikWatch</title>
      </Helmet>
      <section className="search-container">
        <div className="wrapper">
          <div className="row">
            <div className="col-12">
              <div className="search-container_box">
                <input
                  type="text"
                  placeholder="Search websites"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <a className="create-btn" onClick={handleAddNewButton}>
                  Add new
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: "100px" }}>
        <div className="wrapper">
          <div className="row">
            <div className="col-12">
              <table className="custom-table">
                <thead>
                  <tr>
                    {/* <th>Status</th> */}
                    <th style={{ width: "unset" }}>Website</th>
                    <th>URL</th>
                    <th>Client</th>
                    <th>Created at</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {currentWebsites.length > 0 ? (
                    currentWebsites.map((website) => (
                      <tr key={website.id}>
                        {/* <td>
                          {website ? (
                            website.status === 1 ? (
                              <span className="status-badge status-badge_active">
                                ACTIVE
                              </span>
                            ) : (
                              <span className="status-badge status-badge_inactive">
                                INACTIVE
                              </span>
                            )
                          ) : null}
                        </td> */}
                        <td style={{ width: "unset" }}>{website.name}</td>
                        <td>
                          {website.website_url ? (
                            <a
                              href={website.website_url}
                              style={{
                                width: "unset",
                                height: "unset",
                                padding: "unset",
                                backgroundColor: "transparent",
                                textDecoration: "none",
                              }}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {website.website_url}
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>{website.client_name}</td>
                        <td>{formatDateWithClock(website.created_at)}</td>
                        <td style={{ width: "100px" }}>
                          <Box
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                          >
                            {/* <button onClick={() => handleEditClick(website.id)}>
                            <img src={EditIcon} />
                          </button> */}
                            <button
                              onClick={() => handleDetailsClick(website.id)}
                            >
                              <img src={EyeIcon} />
                            </button>
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
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center" }}>
                        No websites found with the query
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {currentWebsites.length > 0 && (
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
            </div>
          </div>
        </div>
      </section>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{ "aria-labelledby": "long-button" }}
        className="custom-more-menu"
      >
        <MenuItem onClick={() => handleEditClick(selectedWebsite.id)}>
          Edit website
        </MenuItem>
        {/* <MenuItem
          className="more-menu-red"
          onClick={() => {
            handleDeleteWebsite(selectedWebsite);
            handleMenuClose();
          }}
        >
          Delete website
        </MenuItem> */}
      </Menu>
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

export default WebsitesPage;
