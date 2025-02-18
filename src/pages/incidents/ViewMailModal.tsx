import React, { useState, useEffect } from "react";
import axios from "axios";

import { formatDateWithClock } from "../../helpers/formatDateWithClock";

import styled from "@emotion/styled";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
} from "@mui/material";

const MessageDetails = styled(Stack)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "40px",
  marginTop: "8px",
  cursor: "default",
});

interface ViewMailModalProps {
  open: boolean;
  onClose: () => void;
  messageId: number | null;
}

const ViewMailModal: React.FC<ViewMailModalProps> = ({
  open,
  onClose,
  messageId,
}) => {
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (import.meta.env.VITE_ENV === "production") {
    backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  }

  const [messageData, setMessageData] = useState<any>(null);

  useEffect(() => {
    if (messageId !== null && open) {
      const fetchMessageData = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          const response = await axios.get(
            `${backendUrl}/api/incident/messages/${messageId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setMessageData(response.data);
        } catch (err) {
          console.error("Error fetching message data:", err);
        }
      };

      fetchMessageData();
    }
  }, [messageId, open, backendUrl]);

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        className="custom-modal"
        sx={{
          "& .MuiPaper-root": {
            maxWidth: "720px",
            width: "100%",
          },
        }}
      >
        <DialogTitle>Message details</DialogTitle>
        <DialogContent>
          {messageData && messageData.message && (
            <>
              <MessageDetails>
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: 400,
                    lineHeight: "24px",
                    color: "#1b2431",
                  }}
                >
                  Sent at:
                  <span style={{ marginLeft: "8px", color: "#7e7e7e" }}>
                    {formatDateWithClock(messageData.message.sent_at)}
                  </span>
                </Typography>
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: 400,
                    lineHeight: "24px",
                    color: "#1b2431",
                  }}
                >
                  Sent to:
                  <span style={{ marginLeft: "8px", color: "#7e7e7e" }}>
                    {messageData.message.sent_to}
                  </span>
                </Typography>
              </MessageDetails>
              <Typography
                sx={{
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  fontSize: "18px",
                  fontWeight: 700,
                  cursor: "default",
                  marginTop: "32px",
                  marginBottom: "4px",
                }}
              >
                Message:
              </Typography>
              <Typography
                sx={{
                  minHeight: "200px",
                  maxHeight: "460px",
                  overflowY: "auto",
                  //padding: "8px 12px 8px 8px",
                  paddingTop: '8px',
                  //border: "1px solid #ced4da",
                  borderRadius: "6px",
                  whiteSpace: "pre-wrap",
                  cursor: "default",

                  "&::-webkit-scrollbar": {
                    width: "6px",
                    backgroundColor: "transparent",
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "transparent",
                    borderRadius: "5px",
                    margin: "8px 0",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#ababab",
                    borderRadius: "5px",
                  },
                }}
              >
                {messageData.message.message}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ marginTop: "24px" }}>
          <div>
            <Button onClick={handleClose} className="cancel-btn">
              Cancel
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ViewMailModal;
