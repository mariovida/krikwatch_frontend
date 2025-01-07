/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Box, Menu, MenuItem, IconButton } from "@mui/material";
import EyeIcon from "../../assets/icons/eye.svg";
import MoreMenuIcon from "../../assets/icons/more-menu.svg";

import { formatDateWithClock } from "../../helpers/formatDateWithClock";

const IncidentsPage = () => {
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (import.meta.env.VITE_ENV === "production") {
    backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  }

  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<any[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<any[]>([]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${backendUrl}/api/incidents`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    console.log(incident);
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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const fetchIncidents = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          const response = await axios.get(`${backendUrl}/api/incidents`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
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

  return (
    <>
      <Helmet>
        <title>Incidents | KrikWatch</title>
      </Helmet>

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
                <table className="custom-table">
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
                    {filteredIncidents.length > 0 ? (
                      filteredIncidents.map((incident) => (
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
                          <td>{incident.title}</td>
                          <td>{incident.website_name}</td>
                          <td>
                            {incident.created_by_first_name +
                              " " +
                              incident.created_by_last_name}
                          </td>
                          <td>{formatDateWithClock(incident.created_at)}</td>
                          <td
                            style={{
                              width: "100px",
                            }}
                          >
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
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        className="custom-more-menu"
      >
        <MenuItem>Edit incident</MenuItem>
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
      </Menu>
    </>
  );
};

export default IncidentsPage;
