/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";

import EditIcon from "../../assets/icons/edit.svg";
import EyeIcon from "../../assets/icons/eye.svg";
import ChevronLeftIcon from "../../assets/icons/ChevronLeft";
import ChevronRightIcon from "../../assets/icons/ChevronRight";

import { formatDateWithClock } from "../../helpers/formatDateWithClock";

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

  useEffect(() => {
    const fetchWebsites = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${backendUrl}/api/websites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  const handleAddNewButton = () => {
    navigate(`/websites/create-new`);
  };

  const handleEditClick = (id: string) => {
    navigate(`/website/${id}/edit`);
  };

  const handleDetailsClick = (id: string) => {
    navigate(`/website/${id}`);
  };

  return (
    <>
      <Helmet>
        <title>Websites | Krik Monitoring</title>
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
                        <td
                          style={{
                            width: "100px",
                          }}
                        >
                          <button onClick={() => handleEditClick(website.id)}>
                            <img src={EditIcon} />
                          </button>
                          <button
                            onClick={() => handleDetailsClick(website.id)}
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
    </>
  );
};

export default WebsitesPage;
