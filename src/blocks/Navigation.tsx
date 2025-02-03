import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

import LogoImage from "../assets/logo.svg";
import FullscreenIcon from "../assets/icons/fullscreen.svg";
import {
  Box,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Divider,
} from "@mui/material";

const Navigation = ({ pageTitle }: { pageTitle?: string }) => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const cleanPathname = location.pathname.replace(/\/$/, "");
  const isSpecialPage =
    cleanPathname === "/" ||
    cleanPathname === "/account" ||
    cleanPathname === "/notifications" ||
    cleanPathname === "/websites/create-new" ||
    cleanPathname === "/incidents/create-new" ||
    /^\/website\/[^/]+($|\/edit$)/.test(cleanPathname) ||
    /^\/incident\/[^/]+($|\/edit$)/.test(cleanPathname);
  const addSpace = cleanPathname === "/";

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const handleAccountSettings = () => {
    navigate("/account");
    handleMenuClose();
  };
  const handleNotificationsPage = () => {
    navigate("/notifications");
    handleMenuClose();
  };

  return (
    <nav>
      <div className="wrapper">
        <div className="row">
          <div className="col-12">
            <div className="nav-btns">
              <div>
                <NavLink to="/">
                  <img className="nav-btns_logo" src={LogoImage} />
                </NavLink>
                <NavLink to="/incidents">Incidents</NavLink>
                <NavLink to="/websites">Websites</NavLink>
                <NavLink to="/clients">Clients</NavLink>
                <NavLink to="/users">Users</NavLink>
                <NavLink to="/calendar">Calendar</NavLink>
              </div>
              <div>
                <button
                  onClick={toggleFullscreen}
                  style={{
                    width: "18px",
                    height: "18px",
                    border: 0,
                    padding: 0,
                  }}
                >
                  <img src={FullscreenIcon} style={{ width: "100%" }} />
                </button>
                <IconButton onClick={handleMenuClick}>
                  <Avatar>
                    {user?.first_name?.charAt(0).toUpperCase()}
                    {user?.last_name?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {!isSpecialPage && <h1>{pageTitle}</h1>}
            {addSpace && <div className="spacer"></div>}
          </div>
        </div>
      </div>

      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "avatar-button",
        }}
        className="avatar-menu"
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box className="user-info">
          <p>
            {user?.first_name} {user?.last_name}
          </p>
          <p>{user?.email}</p>
        </Box>
        <Divider />
        <MenuItem onClick={handleAccountSettings}>Account</MenuItem>
        <MenuItem onClick={handleNotificationsPage}>Notifications</MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>Log out</MenuItem>
      </Menu>
    </nav>
  );
};

export default Navigation;
