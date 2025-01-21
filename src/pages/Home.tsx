/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

import Stats from "../blocks/Stats"

import ChevronLeftIcon from "../assets/icons/ChevronLeft";
import ChevronRightIcon from "../assets/icons/ChevronRight";

const Home = () => {
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (import.meta.env.VITE_ENV === "production") {
    backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  }

  const openIncidents = 5;
  //const totalWebsites = 12;
  const totalClients = 8;

  //const [openIncidents, setOpenIncidents] = useState(0);
  const [totalWebsites, setTotalWebsites] = useState(0);
  const [allSitesUp, setAllSitesUp] = useState(true);
  const [uptimeData, setUptimeData] = useState<any>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const totalPages = Math.ceil(uptimeData.length / itemsPerPage);

  useEffect(() => {
    const fetchUptimeData = async () => {
      try {
        // Call the backend API that fetches data from UptimeRobot
        const response = await fetch(`${backendUrl}/api/uptimerobot`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}), // No need to send API key, as it's already handled by backend
        });
  
        if (response.ok) {
          const data = await response.json();
          const monitors = data.monitors;
  
          setUptimeData(monitors);
  
          // Calculate total websites
          setTotalWebsites(monitors.length);
  
          // Calculate open incidents and check if all sites are up
          const incidents = monitors.filter((monitor: { status: number }) => monitor.status !== 2);
          //setOpenIncidents(incidents.length);
  
          // Update if all sites are up
          setAllSitesUp(incidents.length === 0);
        } else {
          console.error("Error fetching UptimeRobot data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching UptimeRobot data:", error);
      }
    };
  
    fetchUptimeData();
  }, []);  

  const currentMonitors = uptimeData.slice(
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

  return (
    
      <>
        <Helmet>
          <title>KrikWatch</title>
        </Helmet>

        <Stats
          openIncidents={openIncidents}
          totalWebsites={totalWebsites}
          totalClients={totalClients}
        />

        {uptimeData && uptimeData.length > 0 && (
          <section>
            <div className="wrapper">
              <div className="row">
                <div className="col-12">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Name</th>
                        <th>URL</th>
                        <th style={{ width: '180px' }}>Created at</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentMonitors.map((monitor: any) => (
                        <tr key={monitor.id}>
                          <td>
                            <span
                              className={`status ${monitor.status === 2 ? "up" : monitor.status === 9 ? "down" : "unknown"}`}
                            >
                              {monitor.status === 2
                                ? <span className="status-badge status-badge_active">
                                UP
                              </span>
                                : monitor.status === 9
                                ? <span className="status-badge status-badge_inactive">
                                DOWN
                              </span>
                                : "Unknown"}
                            </span>
                          </td>
                          <td>{monitor.friendly_name}</td>
                          <td>
                            <a href={monitor.url} style={{
                                  width: "unset",
                                  height: "unset",
                                  padding: "unset",
                                  backgroundColor: "transparent",
                                  textDecoration: "none",
                                }} target="_blank" rel="noopener noreferrer">
                              {monitor.url}
                            </a>
                          </td>
                          <td>
                            {new Date(monitor.create_datetime * 1000)
                              .toLocaleDateString('en-GB')
                              .replace(/\//g, '.')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="pagination">
                    <button className="pagination-prev" onClick={goToPreviousPage} disabled={currentPage === 1}>
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
                    <button className="pagination-next" onClick={goToNextPage} disabled={currentPage === totalPages}>
                      <ChevronRightIcon />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </>
  );
};

export default Home;
