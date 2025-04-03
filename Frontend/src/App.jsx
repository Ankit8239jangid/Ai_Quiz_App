import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Layout/Layout';
import Home from './Components/Home/Home';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Using 'index' instead of redundant '/' to make Home the default page inside Layout */}
          <Route index element={<Home />} />
        </Route>
        <Route path="quiz/:id" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
