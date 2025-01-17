/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

import Stats from "../blocks/Stats";

import ChevronLeftIcon from "../assets/icons/ChevronLeft";
import ChevronRightIcon from "../assets/icons/ChevronRight";

const Home = () => {
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (import.meta.env.VITE_ENV === "production") {
    backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  }

  const openIncidents = 5;
  const totalWebsites = 12;
  const totalClients = 8;

  //const [openIncidents, setOpenIncidents] = useState(0);
  //const [totalWebsites, setTotalWebsites] = useState(0);
  const [allSitesUp, setAllSitesUp] = useState(true);
  const [uptimeData, setUptimeData] = useState<any>([]);
  const [filteredUptimeData, setFilteredUptimeData] = useState<any>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const totalPages = Math.ceil(filteredUptimeData.length / itemsPerPage);

  useEffect(() => {
    const fetchUptimeData = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/uptimerobot`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        if (response.ok) {
          const data = await response.json();
          const monitors = data.monitors;

          setUptimeData(monitors);
          setFilteredUptimeData(monitors);

          //setTotalWebsites(monitors.length);

          const incidents = monitors.filter(
            (monitor: { status: number }) => monitor.status !== 2
          );
          //setOpenIncidents(incidents.length);

          setAllSitesUp(incidents.length === 0);
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

    fetchUptimeData();
  }, []);

  const sortedData = filteredUptimeData.sort((a: any, b: any) => {
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
        openIncidents={openIncidents}
        totalWebsites={totalWebsites}
        totalClients={totalClients}
      />

      {uptimeData && uptimeData.length > 0 && (
        <>
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
                <div className="col-12">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th style={{ width: "48px" }}></th>
                        <th>Name</th>
                        <th>URL</th>
                        <th style={{ width: "180px" }}>Created at</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentMonitors.map((monitor: any) => (
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
                          <td>
                            {new Date(monitor.create_datetime * 1000)
                              .toLocaleDateString("en-GB")
                              .replace(/\//g, ".")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default Home;
