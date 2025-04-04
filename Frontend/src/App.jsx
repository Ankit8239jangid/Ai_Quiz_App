import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Layout/Layout';
import Home from './Components/Dashbord/Home';

import QuizTest from './Components/QuizTestPage/QuizTest';
import errorImage from '/404error.svg'; // Ensure correct image path

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>

          <Route path='/Dashboard' element={<h1>THis is Deshbord</h1>} />

          <Route path="/quizes" element={<Home />} />

          <Route path="/quiz/test" element={<QuizTest />} />

        </Route>


        {/* 404 Error Page */}
        <Route
          path="*"
          element={
            <div className="flex justify-center items-center min-h-screen">
              <img src={errorImage} alt="404 Not Found" width={600} />
            </div>
          }
        />
      </Routes>

    </BrowserRouter>
  );
}
