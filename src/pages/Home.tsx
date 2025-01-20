import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

import Stats from "../blocks/Stats"

const Home = () => {
  const openIncidents = 5;
  const totalWebsites = 12;
  const totalClients = 8;

  return (
    <>
      <>
        <Helmet>
          <title>KrikWatch</title>
        </Helmet>

        <Stats
          openIncidents={openIncidents}
          totalWebsites={totalWebsites}
          totalClients={totalClients} />
      </>
    </>
  );
};

export default Home;
