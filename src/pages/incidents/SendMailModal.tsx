import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { formatDateWithClock } from "../../helpers/formatDateWithClock";
import ConfirmationModal from "../../blocks/ConfirmationModal";

import styled from "@emotion/styled";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
  Typography,
} from "@mui/material";

const UseTemplateButton = styled(Button)({
  width: "160px",
  fontSize: "15px",
  textTransform: "none",
  lineHeight: "17px",
  color: "#877eb4",
  padding: "12px 16px",
  border: "1px solid #877eb4",
  borderRadius: "6px",

  "&:hover": { backgroundColor: "#f8f8f8" },
});

interface SendMailModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  contactsData: any;
  incidentData: any;
}

const SendMailModal: React.FC<SendMailModalProps> = ({
  open,
  onClose,
  onSuccess,
  contactsData,
  incidentData,
}) => {
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (import.meta.env.VITE_ENV === "production") {
    backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  }

  const navigate = useNavigate();

  const [selectedContactId, setSelectedContactId] = useState<any>(null);
  const [selectedEmail, setSelectedEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messageSent, setMessageSent] = useState<boolean>(false);

  const handleContactChange = (event: any) => {
    const contactId = event.target.value;
    setSelectedContactId(contactId);

    const contact = contactsData.find((c: any) => c.id === contactId);
    setSelectedEmail(contact ? contact.email : "");
  };

  const fillTemplateMessage = () => {
    if (!selectedContactId) return;

    const contact = contactsData.find((c: any) => c.id === selectedContactId);
    const contactName = contact
      ? `${contact.first_name} ${contact.last_name}`
      : "there";

    const templateIdea = `Hello ${contactName},\nWe want to inform you about an incident related to your website. Here are the details:
    
    - **Incident Title**: [Insert Incident Title Here]
    - **Description**: [Insert Incident Description Here]
    - **Status**: [Insert Incident Status Here]
    - **Date**: [Insert Incident Date Here]
    
    Please reach out if you need further information.
    
    Best regards,  
    [Your Company Name]`;

    const template = `Poštovani,\n\nDošlo je do problema s uslugom ${incidentData?.website_name}, zbog čega je trenutno nedostupna. Molimo vas za strpljenje dok radimo na otklanjanju problema kako bismo što prije vratili uslugu u funkciju.\n\n• Detalji incidenta: ${incidentData?.description}\n• Vrijeme prijave problema: ${incidentData?.incident_start ? formatDateWithClock(incidentData.incident_start) : ""}\n• Opis problema:\n\nHvala vam na razumijevanju i strpljenju.\n\nLijep pozdrav,\nKrikstudio`;

    setMessage(template);
  };

  const handleSubmit = async () => {
    if (!selectedEmail || !message) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${backendUrl}/api/contacts/send-email`,
        {
          contactId: selectedContactId,
          email: selectedEmail,
          message,
          incidentId: incidentData.id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response && response.data) {
        if (
          response.data.message &&
          response.data.message === "Email sent successfully!"
        ) {
          setMessageSent(true);
        }
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const handleClose = () => {
    setSelectedContactId(null);
    setSelectedEmail("");
    setMessage("");
    setMessageSent(false);
    onClose();
  };

  const goToWebsiteDetails = () => {
    navigate(`/website/${incidentData.website_id}`);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        className="custom-modal"
        sx={{ "& .MuiPaper-root": { maxWidth: "720px", width: "100%" } }}
      >
        <DialogTitle>Notify contact</DialogTitle>
        <DialogContent>
          <div className="form-fields">
            {contactsData && contactsData.length > 0 && (
              <FormControl fullWidth variant="filled" required>
                <InputLabel id="client-select-label">Select contact</InputLabel>
                <Select
                  labelId="client-select-label"
                  value={selectedContactId || ""}
                  onChange={handleContactChange}
                  label="Select contact"
                >
                  <MenuItem value="" disabled>
                    Select contact
                  </MenuItem>
                  {contactsData.map((contact: any) => (
                    <MenuItem key={contact.id} value={contact.id}>
                      {contact.first_name + " " + contact.last_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {selectedContactId && (
              <>
                <TextField
                  label="Email"
                  name="email"
                  fullWidth
                  variant="filled"
                  value={selectedEmail}
                  disabled
                  sx={{
                    label: { color: "#7e7e7e !important" },
                    input: { WebkitTextFillColor: "#1a1a1a !important" },
                  }}
                />
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <UseTemplateButton onClick={fillTemplateMessage}>
                    Use template
                  </UseTemplateButton>
                </Box>
                <TextField
                  label="Message"
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  fullWidth
                  multiline
                  rows={14}
                  variant="filled"
                  sx={{
                    textarea: {
                      fontSize: "15px",
                      "&::-webkit-scrollbar": {
                        width: "6px",
                        backgroundColor: "transparent",
                      },
                      "&::-webkit-scrollbar-track": {
                        backgroundColor: "transparent",
                        borderRadius: "5px",
                        margin: "6px 0",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#ababab",
                        borderRadius: "5px",
                      },
                    },
                  }}
                />
              </>
            )}
            {!contactsData ||
              (contactsData.length < 1 && (
                <Typography>
                  There are no contacts added for this website.
                </Typography>
              ))}
          </div>
        </DialogContent>
        <DialogActions>
          <div>
            <Button onClick={handleClose} className="cancel-btn">
              Cancel
            </Button>
            {contactsData && contactsData.length > 0 && (
              <Button onClick={handleSubmit} className="submit-btn">
                Send
              </Button>
            )}
            {contactsData && contactsData.length < 1 && (
              <Button onClick={goToWebsiteDetails} className="submit-btn">
                Create contacts
              </Button>
            )}
          </div>
        </DialogActions>
      </Dialog>
      <ConfirmationModal
        open={messageSent}
        onClose={() => {
          handleClose();
          onSuccess();
        }}
        onConfirm={() => {
          handleClose();
          onSuccess();
        }}
        confirmText="Message was sent successfully."
        confirmTitle="Message sent"
        buttonText="Confirm"
      />
    </>
  );
};

export default SendMailModal;
