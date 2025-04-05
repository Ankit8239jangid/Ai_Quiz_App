import React from 'react';
import Sidebar from '../Components/Sidebar/Said_Bar';  // Ensure correct import name
import { Outlet } from "react-router-dom";
import { useAppContext } from '../context/app.context';

function Layout() {
    const { theme } = useAppContext();

    return (
        <div className={`flex h-screen w-full overflow-hidden transition-colors duration-300
            ${theme === 'dark' ? 'bg-neutral-900 text-text-dark' : 'bg-neutral-100 text-text-light'}`}>
            <Sidebar />
            <div className="flex-1 p-4 overflow-auto">
                <Outlet />
            </div>
        </div>
    );
}

export default Layout;
