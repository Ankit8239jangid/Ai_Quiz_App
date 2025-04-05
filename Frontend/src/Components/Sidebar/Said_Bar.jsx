
import { NavLink } from 'react-router-dom';
import logo from '/logo.png';
import { TbLayoutDashboardFilled } from "react-icons/tb";
import {
    FaTh,
    FaPlus,
    FaSignInAlt,
    FaUserPlus,
    FaBars,
    FaTimes,
    FaSun,
    FaMoon,
    FaSignOutAlt,
    FaUser
} from 'react-icons/fa';
import { useAppContext } from '../../context/app.context';
import { useAuth } from '../../context/auth.context';

function SideBar() {
    const { isSidebarOpen, setIsSidebarOpen, theme, toggleTheme } = useAppContext();
    const { currentUser, isAuthenticated, logout } = useAuth();

    // Handle logout
    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    // Sidebar items based on authentication status
  
  // Items for authenticated users
        const sidebarItems = [
            { icon: <TbLayoutDashboardFilled />, label: 'Dashboard', to: '/dashboard' },
            { icon: <FaTh />, label: 'Browse Quizzes', to: '/quizes' },
            { icon: <FaPlus />, label: 'Create Quiz', to: '/create-quiz' },
            { icon: <FaUser />, label: 'Profile', to: '/profile' },
        ];

        isAuthenticated() && [...sidebarItems];


    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className={`h-screen border-r border-gray-700 dark:border-gray-600 shadow-md ${theme === 'dark' ? 'shadow-gray-700' : 'shadow-white'}`}>
            {/* Toggle button - visible only on mobile */}
            <button
                onClick={toggleSidebar}
                type="button"
                className={`fixed top-2 right-2 z-50 p-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-black'} rounded-lg md:hidden`}
            >
                <span className="sr-only">Toggle sidebar</span>
                {isSidebarOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0 md:static dark:bg-gray-900 bg-gray-100`}
                aria-label="Sidebar"
            >
                <div className="px-4 pt-5">
                    <div className="flex items-center justify-between">
                        <NavLink to="/" className="flex items-center gap-2">
                            <img
                                src={logo}
                                className="h-12 hover:scale-110 transition-transform"
                                alt="Logo"
                            />
                            <span className="text-xl font-semibold dark:text-white text-gray-800">Quizzz</span>
                        </NavLink>

                        <div className="flex items-center space-x-2">
                            {/* Theme Toggle Button */}
                            <button
                                onClick={toggleTheme}
                                className={`flex items-center justify-center h-9 w-9 text-sm rounded-full transition-all duration-300 ${theme === 'dark' ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'}`}
                                aria-label="Toggle theme"
                            >
                                {theme === 'dark' ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-4 h-4" />}
                            </button>

                            {/* Logout Button (only shown when authenticated) */}
                            {isAuthenticated() && (
                                <button
                                    onClick={handleLogout}
                                    className={`flex items-center justify-center h-9 w-9 text-sm rounded-full transition-all duration-300 ${theme === 'dark' ? 'bg-red-900 text-red-200 hover:bg-red-800' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                                    aria-label="Logout"
                                >
                                    <FaSignOutAlt className="w-4 h-4" />
                                </button>
                            )}
                        </div>
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
                                        dark:text-white text-gray-800
                                        hover:border ${theme === 'dark' ? 'hover:border-gray-600' : 'hover:border-gray-300'} hover:scale-105
                                        hover:shadow-md group ${isActive ?
                                            `shadow-md border ${theme === 'dark' ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'}` : ''}`
                                    }
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <span className={`w-5 h-5 transition-transform duration-300 group-hover:rotate-12 ${theme === 'dark' ? 'text-primary-dark' : 'text-primary-light'}`}>
                                        {item.icon}
                                    </span>
                                    <span className="flex-1 ms-3 transition-opacity duration-300 group-hover:opacity-90">
                                        {item.label}
                                    </span>
                                    {item.badge && (
                                        <span
                                            className={`px-2 ms-3 text-sm font-medium rounded-full transition-transform duration-300
                                            group-hover:scale-110 ${theme === 'dark' ?
                                                    (item.badge.color.includes('blue') ? 'bg-blue-900 text-blue-200' : 'bg-gray-700 text-gray-200') :
                                                    item.badge.color}`}
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
                    className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-30 md:hidden"
                    onClick={toggleSidebar}
                />
            )}
        </div>
    );
}

export default SideBar;