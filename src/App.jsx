import Header from "./components/components/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import "./App.css";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ResponsiveFooter from "./components/components/Footer";
import PrivateRoute from "./components/components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import RequestResetPassword from "./pages/RequestResetPassword";
import OTPVerification from "./pages/OTPVerification";
import ResetPassword from "./pages/ResetPassword";

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
        <Route
          path="/otp-verification/:hashedEmail"
          element={<OTPVerification />}
        />
        <Route
          path="/reset-password/:hashedEmail"
          element={<ResetPassword />}
        />

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
      <ResponsiveFooter />
    </BrowserRouter>
  );
};

export default App;
