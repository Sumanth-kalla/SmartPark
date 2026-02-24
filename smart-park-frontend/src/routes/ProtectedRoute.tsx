import { Navigate } from "react-router-dom";

interface Props {
    children: JSX.Element;
    allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    // Not logged in
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Role not allowed
    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;