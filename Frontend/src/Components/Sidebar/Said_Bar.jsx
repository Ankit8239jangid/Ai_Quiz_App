import React, { useState } from 'react';
import {
    FaTachometerAlt,
    FaTh,
    FaEnvelope,
    FaUsers,
    FaShoppingBag,
    FaSignInAlt,
    FaUserPlus,
    FaBars,
    FaTimes
} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

function SideBar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const sidebarItems = [
        { icon: <FaTachometerAlt />, label: 'Dashboard', to: '/' },
        { icon: <FaTh />, label: 'Kanban', to: '/kanban', badge: { text: 'Pro', color: 'bg-gray-100 text-gray-800' } },
        { icon: <FaEnvelope />, label: 'Inbox', to: '/inbox', badge: { text: '3', color: 'bg-blue-100 text-blue-800' } },
        { icon: <FaUsers />, label: 'Users', to: '/users' },
        { icon: <FaShoppingBag />, label: 'Products', to: '/products' },
        { icon: <FaSignInAlt />, label: 'Sign In', to: '/signin' },
        { icon: <FaUserPlus />, label: 'Sign Up', to: '/signup' },
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="h-screen">
            {/* Toggle button */}
            <button
                onClick={toggleSidebar}
                type="button"
                className="fixed top-2 right-2 z-50 p-2 text-white bg-black rounded-lg sm:hidden"
            >
                <span className="sr-only">Toggle sidebar</span>
                {isSidebarOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed md:static top-0 left-0 z-40 md:z-0 w-64 h-screen transition-transform duration-300 bg-black 
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`}
                aria-label="Sidebar"
            >
                <div className="px-3 pt-5 pb-10">
                    <div className="flex items-center justify-between">
                        <NavLink to="/" className="flex items-center">
                            <img
                                src="https://flowbite.com/docs/images/logo.svg"
                                className="h-8 me-3 hover:scale-110 transition-transform"
                                alt="Logo"
                            />
                            <span className="text-xl font-semibold text-white">Quizzz</span>
                        </NavLink>
                        <button
                            className="flex items-center justify-center h-7 w-7 text-sm text-white bg-purple-500 rounded-full hover:bg-purple-600"
                        >
                            A
                        </button>
                    </div>
                </div>

                <div className="h-full px-3 pb-4 overflow-y-auto">
                    <ul className="space-y-2 font-medium">
                        {sidebarItems.map((item, index) => (
                            <li key={index}>
                                <NavLink
                                    to={item.to}
                                    className="flex items-center p-2 text-white rounded-lg hover:bg-gray-800"
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <span className="w-5 h-5">{item.icon}</span>
                                    <span className="flex-1 ms-3">{item.label}</span>
                                    {item.badge && (
                                        <span className={`px-2 ms-3 text-sm font-medium rounded-full ${item.badge.color}`}>
                                            {item.badge.text}
                                        </span>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
        </div>
    );
}

export default SideBar;
