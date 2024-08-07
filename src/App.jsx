
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/components/Header";
import WelcomePage from "./pages/WelcomePage";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ResponsiveFooter from "./components/components/Footer";
import PrivateRoute from "./components/components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import RequestResetPassword from "./pages/RequestResetPassword";
import OTPVerification from "./pages/OTPVerification";
import ResetPassword from "./pages/ResetPassword";
import PageNotFound from "./components/components/PageNotFound";
import "./App.css";

// Wrapper component to extract tab from URL and pass it as a prop
const DashboardWrapper = () => {
  const location = useLocation();
  const tab = new URLSearchParams(location.search).get("tab");

  const validTabs = [
    "profile",
    "home-admin",
    "orders-admin",
    "archive-orders",
    "rentals-admin",
    "archive-rentals",
    "schedules",
    "finished-products",
    "raw-materials",
    "accomplishment-report",
    "sales-report",
    "all-users",
    "home",
    "orders",
    "rentals",
    "commercial-job",
    "academic-inventory",
  ];

  return validTabs.includes(tab) ? <Dashboard tab={tab} /> : <PageNotFound />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/forgot-password" element={<RequestResetPassword />} />
        <Route path="/otp-verification/:hashedEmail" element={<OTPVerification />} />
        <Route path="/reset-password/:hashedEmail" element={<ResetPassword />} />

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardWrapper />} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <ResponsiveFooter />
    </BrowserRouter>
  );
};

export default App;
