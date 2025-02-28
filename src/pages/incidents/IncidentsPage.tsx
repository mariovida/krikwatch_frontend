/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Chart4 } from './Chart';

import { Box, Menu, MenuItem, IconButton, Typography, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import EyeIcon from "../../assets/icons/eye.svg";
import MoreMenuIcon from "../../assets/icons/more-menu.svg";
import GraphIcon from "../../assets/icons/graph.svg";
import ChevronLeftIcon from "../../assets/icons/ChevronLeft";
import ChevronRightIcon from "../../assets/icons/ChevronRight";

import { formatDateWithClock } from "../../helpers/formatDateWithClock";
import ConfirmationDeleteModal from "../../blocks/ConfirmDeleteModal";
import { he } from "date-fns/locale";

const IncidentsPage = () => {
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (import.meta.env.VITE_ENV === "production") {
    backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  }

  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<any[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<any[]>([]);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [isChartVisible, setIsChartVisible] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [deleteIncident, setDeleteIncident] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const open = Boolean(anchorEl);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage);

  const currentIncidents = filteredIncidents.slice(
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

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${backendUrl}/api/incidents`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response && response.data && response.data.incidents) {
          setIncidents(response.data.incidents);
          setFilteredIncidents(response.data.incidents);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchIncidents();
  }, [backendUrl]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setCurrentPage(1);

    const filtered = incidents.filter((incident) => {
      return (
        incident.title.toLowerCase().includes(query) ||
        incident.website_name.toLowerCase().includes(query)
      );
    });

    setFilteredIncidents(filtered);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    incident: any
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedIncident(incident);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedIncident(null);
  };

  const handleChangeStatus = async (incidentId: number, newStatus: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      const statusResponse = await axios.put(
        `${backendUrl}/api/incidents/${incidentId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const fetchIncidents = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          const response = await axios.get(`${backendUrl}/api/incidents`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response && response.data && response.data.incidents) {
            setIncidents(response.data.incidents);
            setFilteredIncidents(response.data.incidents);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchIncidents();
      handleMenuClose();
    } catch (error) {
      console.error("Error updating incident status:", error);
    }
  };

  const handleAddNewButton = () => {
    navigate(`/incidents/create-new`);
  };

  const handleDetailsClick = (id: string) => {
    navigate(`/incident/${id}`);
  };

  const handleDeleteIncident = (incident: React.SetStateAction<null>) => {
    if (incident) {
      setDeleteIncident(incident);
    }
    setOpenConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (deleteIncident) {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.delete(
          `${backendUrl}/api/incidents/delete-incident/${deleteIncident.id}`,
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

  const toggleChartVisibility = () => {
    setIsChartVisible((prev) => !prev);
  };

  const processIncidentsForChart = () => {
    const monthCounts = Array(12).fill(0);

    incidents.forEach((incident) => {
      const incidentDate = new Date(incident.created_at);
      const monthIndex = incidentDate.getMonth();
      monthCounts[monthIndex] += 1;
    });

    return monthCounts;
  };

  return (
    <>
      <Helmet>
        <title>Incidents | KrikWatch</title>
      </Helmet>

      <section>
        <div className="wrapper">
          <div className="row">
            <div className="col-12">
              <button 
                onClick={toggleChartVisibility}
                style={{
                  position: 'fixed',
                  bottom: '16px',
                  right: '16px',
                  width: '48px',
                  height: '48px',
                  flex: 'none',
                  display: 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#1b2431',
                  borderRadius: '24px',
                  transition: '0.2s',
                  cursor: 'pointer',
                }}
              >
                 <img src={GraphIcon} style={{ width: '20px', height: '20px' }} />
              </button>
              {isChartVisible && <Chart4 incidents={processIncidentsForChart()} />}
            </div>
          </div>
        </div>
      </section>

      <section className="search-container">
        <div className="wrapper">
          <div className="row">
            <div className="col-12">
              <div className="search-container_box">
                <input
                  type="text"
                  placeholder="Search incidents"
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

      {incidents && (
        <section style={{ paddingBottom: "100px" }}>
          <div className="wrapper">
            <div className="row">
              <div className="col-12">
              <TableContainer component={Paper} className="custom-table">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Status</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Website</TableCell>
                      <TableCell>Author</TableCell>
                      <TableCell>Created at</TableCell>
                      <TableCell style={{ width: "100px" }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentIncidents.length > 0 ? (
                      currentIncidents.map((incident) => (
                        <TableRow key={incident.id}>
                          <TableCell>
                            {incident ? (
                              incident.status === 1 ? (
                                <span className="status-badge status-badge_open">OPEN</span>
                              ) : incident.status === 2 ? (
                                <span className="status-badge status-badge_progress">IN PROGRESS</span>
                              ) : incident.status === 3 ? (
                                <span className="status-badge status-badge_active">RESOLVED</span>
                              ) : incident.status === 4 ? (
                                <span className="status-badge status-badge_closed">CLOSED</span>
                              ) : null
                            ) : null}
                          </TableCell>
                          <TableCell>
                            <span
                              style={{ cursor: "pointer" }}
                              onClick={() => handleDetailsClick(incident.incident_key)}
                            >
                              {incident.title}
                            </span>
                          </TableCell>
                          <TableCell>{incident.website_name}</TableCell>
                          <TableCell>
                            {incident.created_by_first_name + " " + incident.created_by_last_name}
                          </TableCell>
                          <TableCell>{formatDateWithClock(incident.created_at)}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                              <button onClick={() => handleDetailsClick(incident.incident_key)}>
                                <img src={EyeIcon} />
                              </button>
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
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} style={{ textAlign: "center" }}>
                          {incidents.length === 0
                            ? "There are no incidents yet."
                            : "No incidents found with the query."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
                {/* <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Title</th>
                      <th>Website</th>
                      <th>Author</th>
                      <th>Created at</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentIncidents.length > 0 ? (
                      currentIncidents.map((incident) => (
                        <tr key={incident.id}>
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
                          <td><span style={{ cursor: 'pointer'}} onClick={() =>
                                  handleDetailsClick(incident.incident_key)
                                }>{incident.title}</span></td>
                          <td>{incident.website_name}</td>
                          <td>
                            {incident.created_by_first_name +
                              " " +
                              incident.created_by_last_name}
                          </td>
                          <td>{formatDateWithClock(incident.created_at)}</td>
                          <td style={{ width: "100px" }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <button
                                onClick={() =>
                                  handleDetailsClick(incident.incident_key)
                                }
                              >
                                <img src={EyeIcon} />
                              </button>
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
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} style={{ textAlign: "center" }}>
                          {incidents.length === 0
                            ? "There are no incidents yet."
                            : "No incidents found with the query."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table> */}
              </div>
              {currentIncidents.length > 0 && (
                <div className="col-12">
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
        <MenuItem
          onClick={() =>
            navigate(`/incident/${selectedIncident.incident_key}/edit`)
          }
        >
          Edit incident
        </MenuItem>
        {selectedIncident && selectedIncident.status === 1 && (
          <MenuItem onClick={() => handleChangeStatus(selectedIncident.id, 2)}>
            Set as in progress
          </MenuItem>
        )}

        {selectedIncident && selectedIncident.status !== 3 && (
          <MenuItem onClick={() => handleChangeStatus(selectedIncident.id, 3)}>
            Set as resolved
          </MenuItem>
        )}
        <MenuItem
          className="more-menu-red"
          onClick={() => {
            handleDeleteIncident(selectedIncident);
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

export default IncidentsPage;
