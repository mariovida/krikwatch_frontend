import React from "react";
import { Link } from "react-router-dom";
import AttentionIcon from "../assets/icons/attention.svg";
import WebsitesIcon from "../assets/icons/websites.svg";
import UsersIcon from "../assets/icons/users.svg";
import MonitorsIcon from "../assets/icons/bell.svg";

import CountUp from "react-countup";

interface StatsProps {
  monitorsDown: number;
  totalIncidents?: number;
  totalWebsites?: number;
  totalClients?: number;
}

const Stats: React.FC<StatsProps> = ({
  monitorsDown,
  totalIncidents,
  totalWebsites,
  totalClients,
}) => {
  return (
    <section className="stats">
      <div className="wrapper">
        <div className="row" style={{ rowGap: "16px" }}>
          <div className="col-12 col-md-4">
            <div
              className="stats-box"
              style={{
                backgroundColor: monitorsDown > 0 ? "#fceae9" : "#FFFFFF",
                outline: monitorsDown > 0 ? "2px solid #bb241a" : "none",
              }}
            >
              <div className="stats-box_flex">
                <div className="stats-box_icon">
                  <img src={MonitorsIcon} alt="Open Incidents Icon" />
                </div>
                <div>
                  <h6>Monitors down</h6>
                  <p
                    style={{ color: monitorsDown > 0 ? "#bb241a" : "#1b2431" }}
                  >
                    <CountUp start={0} end={monitorsDown} duration={1} />
                  </p>
                </div>
              </div>
              <div className="stats-box_btn">
                <Link
                  to="/monitors"
                  style={{
                    backgroundColor: monitorsDown > 0 ? "#bb241a" : "#EEEEEE",
                    color: monitorsDown > 0 ? "#ffffff" : "#1b2431",
                  }}
                >
                  See all
                </Link>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="stats-box">
              <div className="stats-box_flex">
                <div className="stats-box_icon">
                  <img src={AttentionIcon} alt="Websites Icon" />
                </div>
                <div>
                  <h6>Incidents</h6>
                  <p>
                    <CountUp start={0} end={totalIncidents || 0} duration={1} />
                  </p>
                </div>
              </div>
              <div className="stats-box_btn">
                <Link to="/incidents">See all</Link>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="stats-box">
              <div className="stats-box_flex">
                <div className="stats-box_icon">
                  <img src={WebsitesIcon} alt="Websites Icon" />
                </div>
                <div>
                  <h6>Websites</h6>
                  <p>
                    <CountUp start={0} end={totalWebsites || 0} duration={1} />
                  </p>
                </div>
              </div>
              <div className="stats-box_btn">
                <Link to="/websites">See all</Link>
              </div>
            </div>
          </div>

          {totalClients && (
            <div className="col-12 col-md-4">
              <div className="stats-box">
                <div className="stats-box_flex">
                  <div className="stats-box_icon">
                    <img src={UsersIcon} alt="Clients Icon" />
                  </div>
                  <div>
                    <h6>Clients</h6>
                    <p>
                      <CountUp start={0} end={totalClients || 0} duration={1} />
                    </p>
                  </div>
                </div>
                <div className="stats-box_btn">
                  <Link to="/clients">See all</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Stats;
