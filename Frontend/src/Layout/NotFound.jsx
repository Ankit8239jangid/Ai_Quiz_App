import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, frame } from 'framer-motion';

const NotFound = () => {
  const navigate = useNavigate();

  const blobVariants = {
    animate: {
      scale: [1, 1.2, 0.9, 1],
      x: [0, 50, -20, 0],
      y: [0, -50, 20, 0],
      transition: {
        duration: 15,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const bounceVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-500 relative overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          variants={blobVariants}
          animate="animate"
        />
        <motion.div
          className="absolute w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          variants={blobVariants}
          animate="animate"
          initial={{ x: 0, y: 0 }}
        />
        <motion.div
          className="absolute w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          variants={blobVariants}
          animate="animate"
          initial={{ x: 0, y: 0 }}
        />
      </div>
      <div className="relative z-10 text-center">
        <h1 className="text-9xl font-bold text-white drop-shadow-lg">404</h1>
        <p className="text-2xl text-gray-200 mt-4 mb-8">Oops! The page you’re looking for is lost in space.</p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-colors duration-300"
        >
          Go Home
        </button>
      </div>
      <motion.div
        className="absolute bottom-10 right-10"
        variants={pulseVariants}
        animate="animate"
      >
        <div className="w-24 h-24 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
      </motion.div>
      <motion.div
        className="absolute top-20 left-20"
        variants={bounceVariants}
        animate="animate"
      >
        <div className="w-16 h-16 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
      </motion.div>
    </div>
  );
};

export default NotFound;