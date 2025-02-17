import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";

import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import ArrowLeftIcon from "../../assets/icons/arrow-left.svg";
import MoreMenuIcon from "../../assets/icons/more-menu.svg";

import EditTemplateModal from "./EditTemplateModal";
import ConfirmationDeleteModal from "../../blocks/ConfirmDeleteModal";

const TemplatesPage = () => {
  const navigate = useNavigate();
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (import.meta.env.VITE_ENV === "production") {
    backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  }

  const [templates, setTemplates] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [deleteTemplate, setDeleteTemplate] = useState<any>(null);

  const [templateId, setTemplateId] = useState<any>(null);
  const [templateTitle, setTemplateTitle] = useState<string>("");
  const [templateContent, setTemplateContent] = useState<string>("");
  const [templateModalMode, setTemplateModalMode] = useState<string>("");
  const [openTemplateModal, setOpenTemplateModal] = useState(false);
  const [modalModeEdit, setModalModeEdit] = useState<boolean>(false);
  const [modalModeView, setModalModeView] = useState<boolean>(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${backendUrl}/api/templates`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response && response.data && response.data.templates) {
          setTemplates(response.data.templates);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTemplates();
  }, [backendUrl]);

  const handleClose = () => {
    navigate(`/incidents`);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    template: any
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedTemplate(template);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTemplate(null);
  };

  const handleDeleteTemplate = (template: React.SetStateAction<null>) => {
    if (template) {
      setDeleteTemplate(template);
    }
    setOpenConfirmModal(true);
  };
  const confirmDelete = async () => {
    if (deleteTemplate) {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.delete(
          `${backendUrl}/api/templates/delete-template/${deleteTemplate.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
          window.location.reload();
        }
      } catch (error) {
        console.error("Error deleting website:", error);
      }
    }
  };

  const handleOpenTemplateModal = (mode: string) => {
    if (mode === "edit") {
      setTemplateModalMode("edit");
      setTemplateTitle(selectedTemplate.title);
      setTemplateContent(selectedTemplate.content);
      setModalModeEdit(true);
    } else if (mode === "view") {
      setTemplateModalMode("view");
      setTemplateTitle(selectedTemplate.title);
      setTemplateContent(selectedTemplate.content);
      setModalModeEdit(true);
    } else {
      setTemplateTitle("");
      setTemplateContent("");
      setModalModeEdit(false);
    }
    setOpenTemplateModal(true);
  };
  const handleCloseModal = () => setOpenTemplateModal(false);

  const handleEditTemplate = async (updatedTemplate: {
    title: string;
    content: string;
  }) => {
    if (!updatedTemplate.title || !updatedTemplate.content) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${backendUrl}/api/templates/update-template/${templateId}`,
        updatedTemplate,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setOpenTemplateModal(false);
        window.location.reload();
        setTemplateId(null);
      }
    } catch (error) {
      console.error("Error updating template:", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Templates | KrikWatch</title>
      </Helmet>

      <section>
        <div className="wrapper">
          <div className="row">
            <div className="col-12">
              <Button className="go-back-btn" onClick={handleClose}>
                <img src={ArrowLeftIcon} />
                Incidents
              </Button>
            </div>
            <div className="col-12">
              {templates && templates.length > 0 && (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(340px, 1fr))",
                    gap: "24px",
                  }}
                >
                  {templates.map((template: any) => (
                    <Box className="custom-box" key={template.id}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: "Plus Jakarta Sans, sans-serif",
                            fontSize: "18px",
                            fontWeight: 600,
                            lineHeight: "24px",
                            color: "#1b2431",
                            cursor: "default",
                          }}
                        >
                          {template.title}
                        </Typography>
                        <IconButton
                          aria-label="more"
                          id={`menu-button-${template.id}`}
                          aria-controls={`menu-${template.id}`}
                          aria-haspopup="true"
                          onClick={(e) => handleMenuOpen(e, template)}
                          sx={{ padding: "4px" }}
                        >
                          <img src={MoreMenuIcon} />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </div>
          </div>
        </div>
      </section>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{ "aria-labelledby": "long-button" }}
        className="custom-more-menu"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            handleOpenTemplateModal("view");
            handleMenuClose();
          }}
        >
          View template
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleOpenTemplateModal("edit");
            setTemplateId(selectedTemplate.id);
            handleMenuClose();
          }}
        >
          Edit template
        </MenuItem>
        <MenuItem
          className="more-menu-red"
          onClick={() => {
            handleDeleteTemplate(selectedTemplate);
            handleMenuClose();
          }}
        >
          Delete template
        </MenuItem>
      </Menu>
      <EditTemplateModal
        open={openTemplateModal}
        onClose={handleCloseModal}
        onSubmit={handleEditTemplate}
        mode={templateModalMode}
        templateTitle={templateTitle}
        templateContent={templateContent}
        setTemplateTitle={setTemplateTitle}
        setTemplateContent={setTemplateContent}
      />
      <ConfirmationDeleteModal
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        onConfirm={confirmDelete}
        confirmText="Are you sure you want to delete this template?"
        confirmTitle="Confirm delete"
      />
    </>
  );
};

export default TemplatesPage;
