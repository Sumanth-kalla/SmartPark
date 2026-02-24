import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <div className="w-64 h-screen bg-gray-900 text-white p-6">
            <h2 className="text-xl font-bold mb-8">SmartPark</h2>
            <nav className="space-y-4">
                <Link to="/dashboard/slots" className="block hover:text-gray-300">
                    Slots
                </Link>
                <Link to="/dashboard/bookings" className="block hover:text-gray-300">
                    Bookings
                </Link>
            </nav>
        </div>
    );
};

export default Sidebar;