import React from 'react';
import Sidebar from '../Components/Sidebar/Said_Bar';  // Ensure correct import name
import { Outlet } from "react-router-dom";

function Layout() {
    return (
        <div className="flex min-h-screen w-full bg-black text-white overflow-hidden">
            <Sidebar />
            <Outlet />
        </div>
    );
}

export default Layout;
