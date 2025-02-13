/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";

import { Box, Skeleton, Typography } from "@mui/material";

const MonitorsPage = () => {
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (import.meta.env.VITE_ENV === "production") {
    backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  }

  const [websites, setWebsites] = useState<any[]>([]);
  const [uptimeData, setUptimeData] = useState<any>([]);

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

          const filteredMonitors = monitors.filter((monitor: { id: number }) =>
            websites.some((website) => monitor.id === Number(website.uptime_id))
          );

          setUptimeData(filteredMonitors);
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

    if (websites.length > 0) {
      fetchUptimeData();

      const interval = setInterval(() => {
        fetchUptimeData();
      }, 60000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [backendUrl, websites]);

  return (
    <>
      <Helmet>
        <title>Monitors | KrikWatch</title>
      </Helmet>

      {!uptimeData ||
        (uptimeData && uptimeData.length < 1 && (
          <section>
            <div className="wrapper">
              <div className="row">
                <div className="col-12">
                  <Typography component="div" variant="h2">
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                  </Typography>
                </div>
              </div>
            </div>
          </section>
        ))}
      {uptimeData && uptimeData.length > 0 && (
        <section style={{ paddingBottom: "80px" }}>
          <div className="wrapper">
            <div className="row">
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(200px, 1fr))",
                  gap: "24px",
                }}
              >
                {uptimeData.map((monitor: any) => (
                  <Box
                    className="custom-box"
                    sx={{
                      cursor: "default",
                      outline:
                        monitor.status !== 2 ? "2px solid #bb241a" : "none",
                    }}
                    key={monitor.id}
                  >
                    {monitor.status === 2 ? (
                      <Box className="monitor-life">
                        <span className="loader"></span>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            lineHeight: "20px",
                            fontWeight: 600,
                            color: "#107569",
                          }}
                        >
                          Website is up
                        </Typography>
                      </Box>
                    ) : (
                      <Box className="monitor-life monitor-life_down">
                        <span className="loader"></span>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            lineHeight: "20px",
                            fontWeight: 600,
                            color: "#bb241a",
                          }}
                        >
                          Website is down
                        </Typography>
                      </Box>
                    )}
                    <Box
                      sx={{
                        width: "100%",
                        height: "2px",
                        backgroundColor: "#eeeeee",
                        margin: "16px 0",
                      }}
                    ></Box>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        lineHeight: "18px",
                        fontWeight: 600,
                        color: "#7e7e7e",
                        marginBottom: "20px",
                      }}
                    >
                      ID: {monitor.id}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "18px",
                        lineHeight: "24px",
                        fontWeight: 600,
                      }}
                    >
                      {monitor.friendly_name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        lineHeight: "18px",
                        fontWeight: 400,
                        color: "#7e7e7e",
                      }}
                    >
                      {monitor.url}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default MonitorsPage;
