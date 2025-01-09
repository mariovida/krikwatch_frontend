import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";

import styled from "@emotion/styled";
import { Box, Button, Snackbar, Stack, Typography } from "@mui/material";
import ArrowLeftIcon from "../../assets/icons/arrow-left.svg";

import { formatDateWithClock } from "../../helpers/formatDateWithClock";

const IncidentDetailsPage = () => {
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (import.meta.env.VITE_ENV === "production") {
    backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  }

  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);

  const handleClose = () => {
    navigate(`/incidents`);
  };

  return (
    <>
      <Helmet>
        <title>Website details | KrikWatch</title>
      </Helmet>

      <section>
        <div className="wrapper">
          <div className="row">
            <div className="col-12">
              <Button className="go-back-btn" onClick={handleClose}>
                <img src={ArrowLeftIcon} />
                All incidents
              </Button>
              {id && (
                <Typography
                  sx={{
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    textTransform: "uppercase",
                  }}
                >
                  {id}
                </Typography>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default IncidentDetailsPage;
