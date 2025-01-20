/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

const IncidentsPage = () => {
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (import.meta.env.VITE_ENV === "production") {
    backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  }

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
                //value={searchQuery}
                //onChange={handleSearch}
              />
              <a className="create-btn">
                Add new
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
  );
};

export default IncidentsPage;
