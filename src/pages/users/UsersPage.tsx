/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";

import AddUserModal from "./AddUserModal";
import ChevronUp from "../../assets/icons/arrow-up-right.svg";

import { Snackbar } from "@mui/material";

import { formatDateWithClock } from "../../helpers/formatDateWithClock";

const UsersPage = () => {
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (import.meta.env.VITE_ENV === "production") {
    backendUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  }

  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userExistsError, setUserExistsError] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [modalModeEdit, setModalModeEdit] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${backendUrl}/api/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [backendUrl]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = users.filter((user) => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      return (
        fullName.includes(query) ||
        user.first_name.toLowerCase().includes(query) ||
        user.last_name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    });

    setFilteredUsers(filtered);
  };

  const handleOpenModal = () => {
    setModalModeEdit(false);
    setSelectedUser(null);
    setOpenModal(true);
  };
  const handleCloseModal = () => setOpenModal(false);
  const handleSnackbarClose = () => setUserExistsError(false);

  const handleCreateUser = async () => {
    const newUser = {
      first_name: firstName,
      last_name: lastName,
      email: email,
    };

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(`${backendUrl}/api/users`, newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response && response.data) {
        if (
          response.data.message &&
          response.data.message === "User with this email already exists"
        ) {
          setUserExistsError(true);
        }
      }

      if (response.status === 201) {
        setUsers((prevUsers) => [...prevUsers, response.data.user]);
        setOpenModal(false);
        setFirstName("");
        setLastName("");
        setEmail("");

        window.location.reload();
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleUpdateUser = async () => {
    const updatedUser = {
      first_name: firstName,
      last_name: lastName,
      email: email,
    };

    if (selectedUser) {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.put(
          `${backendUrl}/api/users/${selectedUser.id}`,
          updatedUser,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === selectedUser.id ? response.data.user : user
            )
          );
          setOpenModal(false);
          setSelectedUser(null);
          setFirstName("");
          setLastName("");
          setEmail("");

          //window.location.reload();
        }
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  const handleEditUser = (user: React.SetStateAction<null>) => {
    setSelectedUser(user);
    setModalModeEdit(true);
    setOpenModal(true);
  };

  return (
    <>
      <Helmet>
        <title>Users | KrikWatch</title>
      </Helmet>

      {users && !loading && (
        <>
          <section className="search-container">
            <div className="wrapper">
              <div className="row">
                <div className="col-12">
                  <div className="search-container_box">
                    <input
                      type="text"
                      placeholder="Search users"
                      value={searchQuery}
                      onChange={handleSearch}
                    />
                    <a className="create-btn" onClick={handleOpenModal}>
                      Add new
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="users-table">
            <div className="wrapper">
              <div className="row">
                <div className="col-12">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>First name</th>
                        <th>Last name</th>
                        <th>Email</th>
                        <th>Created at</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr key={user.id}>
                            <td>
                              {user ? (
                                user.verified === false ? (
                                  <span className="status-badge status-badge_closed">
                                    NOT VERIFIED
                                  </span>
                                ) : user.is_verified === 1 ? (
                                  <span className="status-badge status-badge_active">
                                    ACTIVE
                                  </span>
                                ) : (
                                  <span className="status-badge status-badge_inactive">
                                    INACTIVE
                                  </span>
                                )
                              ) : null}
                            </td>
                            <td>{user.first_name}</td>
                            <td>{user.last_name}</td>
                            <td>{user.email}</td>
                            <td>{formatDateWithClock(user.date_created)}</td>
                            <td style={{ width: "100px" }}>
                              <button onClick={() => handleEditUser(user)}>
                                <img src={ChevronUp} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} style={{ textAlign: "center" }}>
                            No user found with the query
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <AddUserModal
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={modalModeEdit ? handleUpdateUser : handleCreateUser}
        editMode={modalModeEdit}
        user={selectedUser}
        firstName={firstName}
        lastName={lastName}
        email={email}
        setFirstName={setFirstName}
        setLastName={setLastName}
        setEmail={setEmail}
      />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={userExistsError}
        onClose={handleSnackbarClose}
        message="User with this email address already exists."
        className="snackbar snackbar-error"
        autoHideDuration={4000}
      />
    </>
  );
};

export default UsersPage;
