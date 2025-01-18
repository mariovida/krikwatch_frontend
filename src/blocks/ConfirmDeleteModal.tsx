import { FC } from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/system/Stack";
import styled from "@emotion/styled";

type ConfirmationDeleteModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  confirmTitle?: string;
  confirmInfo?: string;
  buttonText?: string;
};

const ModalBox = styled(Box)({
  minWidth: "480px",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#ffffff",
  padding: "24px",
  outline: "0",
  border: "0",
  borderRadius: "7px",
  boxShadow: "0 4.1px 18.1px 0 rgba(0, 0, 0, 0.08)",
  "@media (max-width: 640px)": {
    minWidth: "unset",
    width: "calc(100% - 32px)",
  },
});

const GridStack = styled(Stack)({
  flexDirection: "row",
  alignItems: "center",
  gap: "24px",
});

const ModalTitle = styled(Typography)({
  fontSize: "24px",
  fontWeight: "700",
});

const ModalText = styled(Typography)({
  fontSize: "16px",
  fontWeight: "400",
  color: "#7e7e7e",
  marginTop: "6px",
});

const ButtonBox = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
`;

const CancelButton = styled(Button)({
  fontSize: "1rem",
  fontWeight: "600",
  textTransform: "none",
  color: "#1b2431",
  padding: "8px",
  borderRadius: "6px",
  transition: ".2s",

  "&:hover": {
    backgroundColor: "transparent",
  },
});

const ConfirmButton = styled(Button)({
  fontSize: "1rem",
  fontWeight: "600",
  textTransform: "none",
  backgroundColor: "#bb241a",
  color: "#f5f5f5",
  padding: "8px 16px",
  borderRadius: "6px",
  transition: ".2s",

  "&:hover": {
    opacity: 0.9,
  },
});

const ConfirmationDeleteModal: FC<ConfirmationDeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
  confirmText,
  confirmTitle,
  confirmInfo,
  buttonText,
}) => {
  const defaultConfirmTitle = "Delete?";
  const defaultConfirmText = "Are you sure you want to delete this?";
  const defaultButtonText = "Delete";

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <ModalBox>
        <GridStack>
          <Stack>
            <ModalTitle>{confirmTitle || defaultConfirmTitle}</ModalTitle>
            <ModalText>{confirmText || defaultConfirmText}</ModalText>
            {confirmInfo && (
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: "600",
                  //color: customColors.error.main,
                  marginTop: "6px",
                }}
              >
                {confirmInfo}
              </Typography>
            )}
          </Stack>
        </GridStack>
        <ButtonBox>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <ConfirmButton
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {buttonText || defaultButtonText}
          </ConfirmButton>
        </ButtonBox>
      </ModalBox>
    </Modal>
  );
};

export default ConfirmationDeleteModal;
