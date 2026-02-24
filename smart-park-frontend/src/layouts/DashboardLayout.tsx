import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1">
                <div className="h-16 border-b flex items-center px-6 font-semibold">
                    Smart Parking Dashboard
                </div>
                <div className="p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;