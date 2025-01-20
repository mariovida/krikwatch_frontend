/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import EyeIcon from "../../assets/icons/eye.svg";

import { formatDateWithClock } from "../../helpers/formatDateWithClock";

const IncidentsPage = () => {
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (import.meta.env.VITE_ENV === "production") {
    backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  }

  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<any[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<any[]>([]);

  const [searchQuery, setSearchQuery] = useState<string>("");

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

      {incidents && incidents.length > 0 && (
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
                              width: "60px",
                            }}
                          >
                            <button
                              onClick={() =>
                                handleDetailsClick(incident.incident_key)
                              }
                              style={{ marginLeft: "12px" }}
                            >
                              <img src={EyeIcon} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} style={{ textAlign: "center" }}>
                          No incidents found with the query
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
    </>
  );
};

export default IncidentsPage;
