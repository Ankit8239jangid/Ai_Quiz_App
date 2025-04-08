import React from 'react';
import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { FcStatistics } from "react-icons/fc";
import { TbFileCode2 } from 'react-icons/tb';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaRobot, FaTrophy, FaMagic } from 'react-icons/fa';

function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      title: "AI-Powered Quizzes",
      desc: "Generate intelligent quizzes instantly with advanced AI",
      icon: <FaRobot />,
      color: "from-blue-500 to-purple-600",
    },
    {
      title: "Performance Insights",
      desc: "Analyze your progress with detailed statistics",
      icon: <FcStatistics />,
      color: "from-pink-500 to-red-600",
    },
    {
      title: "Quiz Creator",
      desc: "Design and manage your own quiz collections",
      icon: <FaMagic />,
      color: "from-green-500 to-teal-600",
    },
    {
      title: "Community Challenges",
      desc: "Compete with others in exciting quiz battles",
      icon: <FaTrophy />,
      color: "from-yellow-500 to-orange-600",
    },
  ];

  // Responsive Particle component
  const Particle = ({ delay }) => (
    <motion.div
      className="absolute bg-gradient-to-r from-purple-500 to-blue-500 bg-opacity-30 rounded-full hidden md:block"
      style={{
        width: `${Math.random() * 15 + 5}px`,
        height: `${Math.random() * 15 + 5}px`,
        left: `${Math.random() * 100}%`,
      }}
      initial={{ y: '-100vh', opacity: 0 }}
      animate={{ y: '100vh', opacity: [0, 0.7, 0] }}
      transition={{ duration: 5, repeat: Infinity, delay, ease: 'linear' }}
    />
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white font-poppins overflow-hidden relative">
      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <Particle key={i} delay={i * 0.2} />
        ))}
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full h-16 bg-gray-900/90 backdrop-blur-lg flex justify-between items-center px-4 md:px-8 z-20">
        <motion.div
          className="text-xl md:text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-blue-500 to-pink-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          AIQuizGenix
        </motion.div>
        <div className="space-x-2 md:space-x-4 flex items-center">
          <motion.button
            onClick={() => navigate('/login')}
            whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(147, 51, 234, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 px-3 md:px-5 py-2 rounded-full text-xs md:text-sm font-medium shadow-md transition-all duration-300"
          >
            Login
          </motion.button>
          <motion.button
            onClick={() => navigate('/signup')}
            whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(236, 72, 153, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-pink-600 to-purple-600 px-3 md:px-5 py-2 rounded-full text-xs md:text-sm font-medium shadow-md transition-all duration-300"
          >
            Sign Up
          </motion.button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center relative px-4 pt-20 md:pt-24 z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="w-full max-w-5xl relative z-20" // Higher z-index for content
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-gray-200"
            >
              Ignite Your
            </motion.span>
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, type: 'spring', stiffness: 120 }}
              className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mx-2 md:mx-3"
            >
              Quiz Journey
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-gray-200"
            >
              with AI
            </motion.span>
          </h1>
          <p className="text-base md:text-xl text-gray-300 mb-8 max-w-xl mx-auto">
            Experience the future of learning with AI-crafted quizzes and real-time insights.
          </p>
          <motion.button
            onClick={() => navigate('/app/dashboard')}
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold shadow-xl transition-all duration-300 relative z-30" // Highest z-index for button
          >
            Start Your Adventure
          </motion.button>
        </motion.div>

        {/* Responsive AI-themed orbiting elements */}
        <motion.div
          className="absolute w-48 h-48 md:w-72 md:h-72 border-2 border-dashed border-purple-500/30 rounded-full pointer-events-none z-5" // Lower z-index
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute w-64 h-64 md:w-96 md:h-96 border border-blue-500/20 rounded-full pointer-events-none z-5" // Lower z-index
          animate={{ rotate: -360, scale: [1, 0.9, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 md:px-8 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-5xl font-bold text-center mb-12 md:mb-16 bg-gradient-to-r from-purple-400 via-blue-500 to-pink-500 bg-clip-text text-transparent"
        >
          Explore AIQuizGenix
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${feature.color.split(' ')[0]}` }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className={`bg-gray-800/70 backdrop-blur-lg p-4 md:p-6 rounded-xl border border-gray-700/50 hover:border-${feature.color.split(' ')[0]}/70 transition-all duration-300`}
            >
              <div className="text-4xl md:text-5xl mb-4 text-white">
                {feature.icon}
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-300 text-xs md:text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer Call-to-Action */}
      <section className="py-16 md:py-24 text-center bg-gradient-to-t from-gray-900 via-gray-800/50 to-transparent z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Transform Your Learning
          </h2>
          <p className="text-sm md:text-lg text-gray-300 mb-6 md:mb-8 max-w-xl mx-auto">
            Join a global community mastering knowledge with AI-powered quizzes.
          </p>
          <motion.button
            onClick={() => navigate('/signup')}
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-6 md:px-10 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold shadow-xl transition-all duration-300"
          >
            Join Now - It’s Free!
          </motion.button>
        </motion.div>
      </section>

      {/* Responsive Animated AI Light Lines */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {/* Line 1 */}
        <motion.div
          className="absolute top-[80vh] w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent "
          initial={{ x: '-100%' }}
          animate={{ x: '50%' }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Line 2 */}
        <motion.div
          className="absolute top-[80vh] w-1/2 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent "
          initial={{ x: '52%' }}
          animate={{ x: '100%', opacity: [0, 1, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
            delay: 2, // Start after Line 1 finishes
            repeatDelay: 3, // Wait for Line 1 before repeating
          }}
        />
      </div>

      {/* Footer */}
      <footer className="py-12 md:py-16 px-4 w-full flex flex-col items-center bg-gray-900 relative z-10">
        <div className="max-w-5xl w-full text-center">
          <div className="flex justify-center items-center space-x-2 mb-8">
            <TbFileCode2 className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              AIQuizGenix
            </span>
          </div>
          <ul className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8">
            {["About", "Careers", "History", "Services", "Projects", "Blog"].map((item) => (
              <li key={item}>
                <a href="#" className="text-gray-300 text-sm md:text-base hover:text-white transition duration-300">
                  {item}
                </a>
              </li>
            ))}
          </ul>
          <ul className="flex justify-center gap-6 md:gap-8 mb-8">
            {[
              { href: "#", label: "Facebook", icon: FaFacebook },
              { href: "https://www.instagram.com/ankitjangid__001/", label: "Instagram", icon: FaInstagram },
              { href: "https://x.com/AnkitJangid82", label: "Twitter", icon: FaTwitter },
              { href: "https://www.linkedin.com/in/ankit-jangid-417b902bb", label: "LinkedIn", icon: FaLinkedin },
            ].map(({ href, label, icon: Icon }) => (
              <li key={label}>
                <NavLink
                  to={href}
                  rel="noreferrer"
                  target="_blank"
                  className="text-gray-300 hover:text-white transition duration-300"
                >
                  <span className="sr-only">{label}</span>
                  <Icon className="w-6 h-6 md:w-7 md:h-7" />
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-center text-gray-400 text-sm">
          <p>Created By Ankit Jangid</p>
          <p>© {new Date().getFullYear()} AIQuizGenix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;