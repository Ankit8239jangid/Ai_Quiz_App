import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  // Particle component for subtle background animation
  const navigator = useNavigate()
  const Particle = () => (
    <motion.div
      className="absolute w-2 h-2 bg-white bg-opacity-20 rounded-full"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 100, opacity: [0, 0.5, 0] }}
      transition={{ duration: 4, repeat: Infinity }}
      style={{ left: `${Math.random() * 100}vw`, top: `${Math.random() * 100}vh` }}
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-t from-purple-900 to-gray-800 text-white font-poppins overflow-hidden relative">
      {/* Header Section */}
      <header className="fixed top-0 w-full h-16 bg-transparent flex justify-between items-center px-6 z-10">
        <div className="text-xl font-bold text-yellow-400">QuizMaster</div>
        <div className="space-x-4">
          <motion.button
          onClick={()=> navigator('/login')}
            whileHover={{ scale: 1.1 }}
            className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-500 transition-colors duration-300"
          >
            Login
          </motion.button>
          <motion.button
          onClick={()=> navigator('/signup')}
            whileHover={{ scale: 1.1 }}
            className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-500 transition-colors duration-300"
          >
            Sign Up
          </motion.button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center text-center relative">
        {/* Background Particles */}
        {Array.from({ length: 20 }).map((_, index) => <Particle key={index} />)}

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="z-10"
        >
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-white">Discover Your</span>
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mx-2">
              Quiz Personality
            </span>
            <span className="text-white">Today!</span>
          </h1>
          <p className="text-lg text-gray-300 mb-6">#1 Quiz Platform Backed by AI</p>
          <motion.button
          onClick={()=> navigator('/app/dashboard')}
            whileHover={{ scale: 1.05 }}
            className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-500 transition-colors duration-300"
          >
            Take the Quiz
          </motion.button>
        </motion.div>

        {/* Subtle Illustrations (Placeholder) */}
        <div className="absolute top-1/4 left-10 opacity-20">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
        <div className="absolute bottom-1/4 right-10 opacity-20 rotate-90">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="h-32 bg-gray-900 flex justify-between items-center px-6 py-4">
        <div>
          <p className="text-sm">QuizMaster © 2025</p>
          <p className="text-xs text-gray-400">Empowering Learning with Fun</p>
        </div>
        <div className="space-x-4">
          <motion.a
            whileHover={{ scale: 1.1 }}
            href="#"
            className="text-gray-300 hover:text-purple-400 transition-colors duration-300"
          >
            About Us
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.1 }}
            href="#"
            className="text-gray-300 hover:text-purple-400 transition-colors duration-300"
          >
            Contact
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.1 }}
            href="#"
            className="text-gray-300 hover:text-purple-400 transition-colors duration-300"
          >
            Privacy Policy
          </motion.a>
        </div>
        <div className="space-x-4">
          <motion.span
            whileHover={{ rotate: 360 }}
            className="cursor-pointer text-gray-300 hover:text-purple-400 transition-transform duration-300"
          >
            🐦
          </motion.span>
          <motion.span
            whileHover={{ rotate: 360 }}
            className="cursor-pointer text-gray-300 hover:text-purple-400 transition-transform duration-300"
          >
            📸
          </motion.span>
          <motion.span
            whileHover={{ rotate: 360 }}
            className="cursor-pointer text-gray-300 hover:text-purple-400 transition-transform duration-300"
          >
            💼
          </motion.span>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;