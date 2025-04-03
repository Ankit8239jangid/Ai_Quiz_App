import React from 'react';
import error from '/404error.svg'
import { BrowserRouter, Route, Routes, } from 'react-router-dom';
import Layout from './Layout/Layout';
import Home from './Components/Dashbord/Home';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Dashboard" element={<Layout />}>
          {/* Using 'index' instead of redundant '/' to make Home the default page inside Layout */}
          <Route index element={<Home />} />
        </Route>
        <Route path="quiz/:id" element={<h1>Under construction :)</h1>} />
        <Route path="*" element={<img src={error} path='404' className=' md:translate-x-72' width={600} />} />
      </Routes>
    </BrowserRouter>
  );
}
