import React from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";

interface WebsiteInfoModalProps {
  open: boolean;
  onClose: () => void;
  data: any;
}

const WebsiteInfoModal: React.FC<WebsiteInfoModalProps> = ({
  open,
  onClose,
  data,
}) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className="custom-modal"
      sx={{
        "& .MuiPaper-root": {
          maxWidth: "500px",
          width: "100%",
        },
      }}
    >
      <DialogTitle sx={{ marginBottom: "16px" }}>
        Website information
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ whiteSpace: "pre-wrap" }}>{data}</Typography>
      </DialogContent>
      <DialogActions sx={{ marginTop: "16px" }}>
        <div>
          <Button onClick={handleClose} className="cancel-btn">
            Cancel
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default WebsiteInfoModal;
