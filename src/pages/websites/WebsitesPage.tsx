/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";

import ChevronRight from "../../assets/icons/arrow-right.svg";

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
        setWebsites(response.data.websites);
        setFilteredWebsites(response.data.websites);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWebsites();
  }, [backendUrl]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

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

  const handleDetailsClick = (id: string) => {
    navigate(`/website/${id}/edit`);
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

    <section className="users-table">
      <div className="wrapper">
        <div className="row">
          <div className="col-12">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Website</th>
                  <th>URL</th>
                  <th>Client</th>
                  <th>Created at</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredWebsites.length > 0 ? (
                  filteredWebsites.map((website) => (
                    <tr key={website.id}>
                      <td>
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
                      </td>
                      <td>{website.name}</td>
                      <td>
                        {website.website_url ? (
                          <a href={website.website_url} style={{ 
                            width: 'unset', 
                            height: 'unset', 
                            padding: 'unset', 
                            backgroundColor: 'transparent',
                            textDecoration: 'none',
                            }}
                            target="_blank" rel="noopener noreferrer">
                            {website.website_url}
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>{website.client_name}</td>
                      <td>{formatDateWithClock(website.created_at)}</td>
                      <td style={{ width: "80px" }}>
                        <button onClick={() => handleDetailsClick(website.id)}>
                          <img src={ChevronRight} />
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
          </div>
        </div>
      </div>
    </section>
  </>
  );
};

export default WebsitesPage;
