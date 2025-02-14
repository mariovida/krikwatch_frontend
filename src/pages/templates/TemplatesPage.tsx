import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

import { Box, TextField, Button, Typography, Tabs, Tab } from "@mui/material";
const TemplatesPage = () => {
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (import.meta.env.VITE_ENV === "production") {
    backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  }

  return (
    <>
      <Helmet>
        <title>Templates | Krik Monitoring</title>
      </Helmet>

      <section>
        <div className="wrapper">
          <div className="row">
            <div className="col-12">s</div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TemplatesPage;
