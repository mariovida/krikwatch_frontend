/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";

import { Typography, Skeleton } from "@mui/material";
import Stats from "../blocks/Stats";

import ChevronLeftIcon from "../assets/icons/ChevronLeft";
import ChevronRightIcon from "../assets/icons/ChevronRight";

import { formatDate } from "../helpers/formatDate";

const Home = () => {
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (import.meta.env.VITE_ENV === "production") {
    backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  }

  const [monitorsDown, setMonitorsDown] = useState(0);
  const [totalWebsites, setTotalWebsites] = useState(0);
  const [totalIncidents, setTotalIncidents] = useState<number>(0);
  const [allSitesUp, setAllSitesUp] = useState(true);
  const [websites, setWebsites] = useState<any[]>([]);
  const [uptimeData, setUptimeData] = useState<any>([]);
  const [timeUntilNextFetch, setTimeUntilNextFetch] = useState(300);
  const [filteredUptimeData, setFilteredUptimeData] = useState<any>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const totalPages = Math.ceil(filteredUptimeData.length / itemsPerPage);

  const handleSendSMS = async () => {
    try {
      const to = "";
      const from = "";
      const text = "Message sent!";

      const response = await fetch(`${backendUrl}/api/send-sms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: to, from: from, text: text }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("SMS sent successfully:", data);
        alert("SMS sent successfully!");
      } else {
        console.error("Error sending SMS:", response.statusText);
        alert("Error sending SMS");
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
      alert("Error sending SMS");
    }
  };

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${backendUrl}/api/incidents`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response && response.data && response.data.incidents) {
          setTotalIncidents(response.data.incidents.length);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchIncidents();
  }, [backendUrl]);

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${backendUrl}/api/websites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWebsites(response.data.websites);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchWebsites();
  }, [backendUrl]);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          return;
        }
      });
    }
  }, []);

  useEffect(() => {
    const fetchUptimeData = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/uptimerobot`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        if (response.ok) {
          const data = await response.json();
          const monitors = data.monitors;

          const filteredMonitors = monitors
            .filter((monitor: { id: number }) =>
              websites.some(
                (website) => monitor.id === Number(website.uptime_id)
              )
            )
            .map((monitor: { status: number; id: number }) => {
              const website = websites.find(
                (website) => monitor.id === Number(website.uptime_id)
              );

              /* if (monitor.id === 797098111 || monitor.id === 798307817) {
                monitor.status = 9;
              }*/

              return {
                ...monitor,
                created_at: website
                  ? new Date(website.created_at || Date.now()).toISOString()
                  : null,
                client_name: website ? website.client_name : null,
              };
            });

          setUptimeData(filteredMonitors);
          setFilteredUptimeData(filteredMonitors);
          setTotalWebsites(filteredMonitors.length);

          setTimeUntilNextFetch(120);

          const incidents = filteredMonitors.filter(
            (monitor: { status: number }) => monitor.status !== 2
          );
          setMonitorsDown(incidents.length);
          setAllSitesUp(incidents.length === 0);
          if (incidents.length > 0) {
            let notifiedIncidents = JSON.parse(
              localStorage.getItem("notifiedIncidents") || "[]"
            );

            incidents.forEach(
              (incident: { id: string; friendly_name: string }) => {
                if (!notifiedIncidents.includes(incident.id)) {
                  showNotification(incident.friendly_name);
                  notifiedIncidents.push(incident.id);
                }
              }
            );
            notifiedIncidents = notifiedIncidents.filter((id: string) =>
              incidents.some(
                (incident: any) => incident.id === id && incident.status !== 3
              )
            );
            localStorage.setItem(
              "notifiedIncidents",
              JSON.stringify(notifiedIncidents)
            );
            /*incidents.forEach((incident: { friendly_name: string }) => {
              showNotification(incident.friendly_name);
            });*/
          }
        } else {
          console.error(
            "Error fetching UptimeRobot data:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching UptimeRobot data:", error);
      }
    };

    const showNotification = (websiteName: string) => {
      if (Notification.permission === "granted") {
        new Notification("Website down", {
          body: `⚠️ ${websiteName} is currently down!`,
        });
      }
    };

    if (websites.length > 0) {
      fetchUptimeData();

      const interval = setInterval(() => {
        fetchUptimeData();
      }, 120000);
      const countdownInterval = setInterval(() => {
        setTimeUntilNextFetch((prev) => (prev > 0 ? prev - 1 : 120));
      }, 1000);
      return () => {
        clearInterval(interval);
        clearInterval(countdownInterval);
      };
    }
  }, [backendUrl, websites]);

  const sortedData = [...filteredUptimeData].sort((a, b) => {
    if (a.status === 9 && b.status !== 9) return -1;
    if (a.status !== 9 && b.status === 9) return 1;
    return 0;
  });

  const currentMonitors = sortedData.slice(
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

    const filtered = uptimeData.filter((data: { friendly_name: string }) => {
      return data.friendly_name.toLowerCase().includes(query);
    });

    setFilteredUptimeData(filtered);
    setCurrentPage(1);
  };

  return (
    <>
      <Helmet>
        <title>KrikWatch</title>
      </Helmet>

      <Stats
        monitorsDown={monitorsDown}
        totalWebsites={totalWebsites}
        totalIncidents={totalIncidents}
        //totalClients={totalClients}
      />

      {!uptimeData ||
        (uptimeData && uptimeData.length < 1 && (
          <section>
            <div className="wrapper">
              <div className="row">
                <div
                  className="col-12"
                  //style={{ display: "flex", justifyContent: "center" }}
                >
                  <Typography component="div" variant="h2">
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                  </Typography>
                  {/* <span className="loader-2"></span> */}
                </div>
              </div>
            </div>
          </section>
        ))}
      {uptimeData && uptimeData.length > 0 && (
        <>
          <section style={{ marginBottom: "8px" }}>
            <div className="wrapper">
              <div className="row">
                <div className="col-12">
                  <div>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        textAlign: "right",
                        color: "#495057",
                        cursor: "default",
                      }}
                    >
                      Next API fetch in:{" "}
                      <span
                        style={{
                          display: "inline-block",
                          width: "96px",
                          fontWeight: 500,
                          color: "#333333",
                        }}
                      >
                        {timeUntilNextFetch} seconds
                      </span>
                    </Typography>
                  </div>
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
                      placeholder="Search monitors"
                      value={searchQuery}
                      onChange={handleSearch}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section style={{ paddingBottom: "100px" }}>
            <div className="wrapper">
              <div className="row">
                <div className="col-12" style={{ overflowX: "auto" }}>
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th style={{ width: "48px" }}></th>
                        <th>Name</th>
                        <th>URL</th>
                        <th>Client</th>
                        <th style={{ width: "180px" }}>Created at</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentMonitors.length > 0 ? (
                        currentMonitors.map((monitor: any) => (
                          <tr key={monitor.id}>
                            <td style={{ width: "48px" }}>
                              {monitor.status === 2 ? (
                                <span className="monitor-status monitor-status_up"></span>
                              ) : monitor.status === 9 ? (
                                <span className="monitor-status monitor-status_down"></span>
                              ) : (
                                "Unknown"
                              )}
                            </td>
                            <td>{monitor.friendly_name}</td>
                            <td>
                              <a
                                href={monitor.url}
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
                                {monitor.url}
                              </a>
                            </td>
                            <td>{monitor.client_name}</td>
                            <td>{formatDate(monitor.created_at)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} style={{ textAlign: "center" }}>
                            No monitors found with the query
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {currentMonitors.length > 0 && (
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
      )}
    </>
  );
};

export default Home;
