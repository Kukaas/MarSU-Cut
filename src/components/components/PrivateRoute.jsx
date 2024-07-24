import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { logout } from "@/redux/user/userSlice";

const PrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Check if the token is valid
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert to seconds
        if (decodedToken.exp < currentTime) {
          // Token has expired
          localStorage.removeItem("token"); // Clear the expired token
          dispatch(logout());
          window.alert("Your session has expired please login again!");
          navigate("/sign-in"); // Redirect to sign-in page
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token"); // In case of decoding error, clear the token
        navigate("/sign-in"); // Redirect to sign-in page
      }
    } else {
      // No token found, redirect to sign-in page
      navigate("/sign-in");
    }
  }, [navigate, dispatch]);

  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
