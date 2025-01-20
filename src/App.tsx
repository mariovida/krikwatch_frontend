import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { UserProvider } from "./context/UserContext";

import "./App.scss";

// Fonts
import "@fontsource/dm-sans/300.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";

// Pages
import LoginPage from "./pages/LoginPage";
import SetPasswordPage from "./pages/SetPasswordPage";
import SetPasswordSuccessPage from "./pages/SetPasswordSuccessPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Home from "./pages/Home";
import IncidentsPage from "./pages/incidents/IncidentsPage";
import IncidentDetailsPage from "./pages/incidents/IncidentDetailsPage";
import NewIncidentPage from "./pages/incidents/NewIncidentPage";
import WebsitesPage from "./pages/websites/WebsitesPage";
import NewWebsitePage from "./pages/websites/NewWebsitePage";
import WebsiteDetailsPage from "./pages/websites/WebsiteDetailsPage";
import EditWebsitePage from "./pages/websites/EditWebsitePage";
import ClientsPage from "./pages/clients/ClientsPage";
import UsersPage from "./pages/users/UsersPage";
import AccountPage from "./pages/AccountPage";
import NotificationsPage from "./pages/NotificationsPage";
import MonitorsPage from "./pages/monitors//MonitorsPage";

import PrivateRoute from "./auth/PrivateRoute";

import Navigation from "./blocks/Navigation";

function App() {
  return (
    <HelmetProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/password-create" element={<SetPasswordPage />} />
            <Route
              path="/password-created"
              element={<SetPasswordSuccessPage />}
            />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/password-reset" element={<ResetPasswordPage />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <>
                    <Navigation />
                    <Home />
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/incidents"
              element={
                <PrivateRoute>
                  <>
                    <Navigation pageTitle="Incidents" />
                    <IncidentsPage />
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/incidents/create-new"
              element={
                <PrivateRoute>
                  <>
                    <Navigation />
                    <NewIncidentPage />
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/incident/:id"
              element={
                <PrivateRoute>
                  <>
                    <Navigation />
                    <IncidentDetailsPage />
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/websites"
              element={
                <PrivateRoute>
                  <>
                    <Navigation pageTitle="Websites" />
                    <WebsitesPage />
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/website/:id"
              element={
                <PrivateRoute>
                  <>
                    <Navigation />
                    <WebsiteDetailsPage />
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/websites/create-new"
              element={
                <PrivateRoute>
                  <>
                    <Navigation />
                    <NewWebsitePage />
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/website/:id/edit"
              element={
                <PrivateRoute>
                  <>
                    <Navigation />
                    <EditWebsitePage />
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/clients"
              element={
                <PrivateRoute>
                  <>
                    <Navigation pageTitle="Clients" />
                    <ClientsPage />
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute>
                  <>
                    <Navigation pageTitle="Users" />
                    <UsersPage />
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/account"
              element={
                <PrivateRoute>
                  <>
                    <Navigation />
                    <AccountPage />
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <PrivateRoute>
                  <>
                    <Navigation />
                    <NotificationsPage />
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/monitors"
              element={
                <PrivateRoute>
                  <>
                    <Navigation pageTitle="Monitors" />
                    <MonitorsPage />
                  </>
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </UserProvider>
    </HelmetProvider>
  );
}

export default App;
