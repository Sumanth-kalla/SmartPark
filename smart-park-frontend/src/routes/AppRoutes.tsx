import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";

import UserDashboard from "../pages/UserDashboard";
import StaffDashboard from "../pages/StaffDashboard";
import AdminDashboard from "../pages/AdminDashboard";

import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route
                path="/dashboard/user"
                element={
                    <ProtectedRoute allowedRoles={["user"]}>
                        <UserDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/dashboard/staff"
                element={
                    <ProtectedRoute allowedRoles={["staff"]}>
                        <StaffDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/dashboard/admin"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default AppRoutes;