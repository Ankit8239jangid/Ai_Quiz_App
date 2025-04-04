
import { NavLink } from 'react-router-dom';
import logo from '/logo.png';
import { TbLayoutDashboardFilled } from "react-icons/tb";
import {
    FaTh,
    FaEnvelope,
    FaUsers,
    FaShoppingBag,
    FaSignInAlt,
    FaUserPlus,
    FaBars,
    FaTimes
} from 'react-icons/fa';
import { useAppContext } from '../../context/app.context';

function SideBar() {
    const { isSidebarOpen, setIsSidebarOpen } = useAppContext();

    // Sidebar items
    const sidebarItems = [
        { icon: <TbLayoutDashboardFilled />, label: 'Dashboard', to: '/Dashboard' },
        { icon: <FaTh />, label: 'Quizes', to: '/quizes', badge: { text: 'Pro', color: 'bg-gray-100 text-gray-800' } },
        { icon: <FaEnvelope />, label: 'Inbox', to: '/inbox', badge: { text: '3', color: 'bg-blue-100 text-blue-800' } },
        { icon: <FaUsers />, label: 'Users', to: '/users' },
        { icon: <FaShoppingBag />, label: 'Products', to: '/products' },
        { icon: <FaSignInAlt />, label: 'Sign In', to: '/signin' },
        { icon: <FaUserPlus />, label: 'Sign Up', to: '/signup' },
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="h-screen border-r-gray-100 shadow-md shadow-white">
            {/* Toggle button - visible only on mobile */}
            <button
                onClick={toggleSidebar}
                type="button"
                className="fixed top-2 right-2 z-50 p-2 bg-black rounded-lg md:hidden"
            >
                <span className="sr-only">Toggle sidebar</span>
                {isSidebarOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                    md:translate-x-0 md:static`}
                aria-label="Sidebar"
            >
                <div className="px-4 pt-5">
                    <div className="flex items-center justify-between">
                        <NavLink to="/" className="flex items-center">
                            <img
                                src={logo}
                                className="h-12 hover:scale-110 transition-transform"
                                alt="Logo"
                            />
                            <span className="text-xl font-semibold">Quizzz</span>
                        </NavLink>
                        <button
                            className="flex items-center justify-center h-7 w-7 text-sm bg-purple-500 rounded-full hover:bg-purple-600"
                        >
                            A
                        </button>
                    </div>
                </div>

                <div className="h-full px-3 pb-4 pt-5 overflow-y-auto">
                    <ul className="space-y-2 font-medium">
                        {sidebarItems.map((item, index) => (
                            <li key={index}>
                                <NavLink
                                    to={item.to}
                                    className={({ isActive }) =>
                                        `flex items-center p-2 rounded-lg transition-all duration-300 ease-in-out
         hover:border hover:border-gray-300 hover:scale-105 
        hover:shadow-md group ${isActive ? ' shadow-md border border-gray-300 ' : ''}`
                                    }
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <span className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12">
                                        {item.icon}
                                    </span>
                                    <span className="flex-1 ms-3 transition-opacity duration-300 group-hover:opacity-90">
                                        {item.label}
                                    </span>
                                    {item.badge && (
                                        <span
                                            className={`px-2 ms-3 text-sm font-medium rounded-full transition-transform duration-300 
            group-hover:scale-110 ${item.badge.color}`}
                                        >
                                            {item.badge.text}
                                        </span>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            {/* Overlay for mobile when sidebar is open */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-100 z-30 md:hidden"
                    onClick={toggleSidebar}
                />
            )}
        </div>
    );
}

export default SideBar;