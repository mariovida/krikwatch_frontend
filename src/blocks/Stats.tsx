import React from "react";
import { Link } from "react-router-dom";
import AttentionIcon from "../assets/icons/attention.svg";
import WebsitesIcon from "../assets/icons/websites.svg";
import UsersIcon from "../assets/icons/users.svg";
//import ArrowRightIcon from "../assets/icons/arrow-right.svg";

import CountUp from 'react-countup';

interface StatsProps {
  openIncidents: number;
  totalWebsites: number;
  totalClients: number;
}

const Stats: React.FC<StatsProps> = ({ openIncidents, totalWebsites, totalClients }) => {
  return (
    <section className="stats">
      <div className="wrapper">
        <div className="row">
          <div className="col-12 col-md-4">
            <div className="stats-box">
              <div className="stats-box_flex">
                <div className="stats-box_icon">
                  <img src={AttentionIcon} alt="Open Incidents Icon" />
                </div>
                <div>
                  <h6>Open incidents</h6>
                  <p style={{ color: openIncidents > 0 ? "#bb241a" : "#107569" }}>
                    <CountUp
                      start={0}
                      end={openIncidents}
                      duration={1}
                    />
                  </p>
                </div>
              </div>
              <div className="stats-box_btn">
                <Link to="/incidents">
                  See all
                </Link>
              </div>
            </div>
          </div>

          {/* Total Websites Stat */}
          <div className="col-12 col-md-4">
            <div className="stats-box">
              <div className="stats-box_flex">
                <div className="stats-box_icon">
                  <img src={WebsitesIcon} alt="Websites Icon" />
                </div>
                <div>
                  <h6>Websites</h6>
                  <p>
                    <CountUp
                      start={0}
                      end={totalWebsites}
                      duration={1}
                    />
                  </p>
                </div>
              </div>
              <div className="stats-box_btn">
                <Link to="/websites">
                  See all
                </Link>
              </div>
            </div>
          </div>

          {/* Total Clients Stat */}
          <div className="col-12 col-md-4">
            <div className="stats-box">
              <div className="stats-box_flex">
                <div className="stats-box_icon">
                  <img src={UsersIcon} alt="Clients Icon" />
                </div>
                <div>
                  <h6>Clients</h6>
                  <p>
                    <CountUp
                      start={0}
                      end={totalClients}
                      duration={1}
                    />
                  </p>
                </div>
              </div>
              <div className="stats-box_btn">
                <Link to="/clients">
                  See all
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
