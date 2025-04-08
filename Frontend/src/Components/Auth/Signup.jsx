import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/auth.context';
import { useAppContext } from '../../context/app.context';
import { FaUser, FaLock, FaEnvelope, FaUserPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        firstname: '',
        lastname: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register } = useAuth();
    const { theme } = useAppContext();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: '',
            });
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.firstname) {
            errors.firstname = 'First name is required';
        }

        if (!formData.lastname) {
            errors.lastname = 'Last name is required';
        }

        if (!formData.username) {
            errors.username = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.username)) {
            errors.username = 'Email is invalid';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            const firstError = Object.values(errors)[0];
            toast.error(firstError);
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await register(formData);

            if (result.success) {
                navigate('/app/dashboard');
            } else {
                toast.error(result.message);
                setFormErrors({ general: result.message });
            }
        } catch (error) {
            const errorMessage = 'Registration failed. Please try again.';
            toast.error(errorMessage);
            setFormErrors({ general: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Animation variants for the container
    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.1,
                when: 'beforeChildren',
                staggerChildren: 0.2,
            },
        },
    };

    // Animation variants for form elements
    const childVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3 },
        },
    };


    return (
        <div
            className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
                }`}
        >
            {/* Background Particles for AI Effect */}
            {theme === 'dark' || 'light' &&
                Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-green-500  rounded-full"
                        style={{
                            width: `${Math.random() * 10 + 5}px`,
                            height: `${Math.random() * 10 + 5}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0, 0.8, 0],
                            scale: [0.7, 1, 0.7],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3,
                            ease: 'easeInOut',
                        }}
                    />
                ))}

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={`max-w-md w-full p-8 rounded-xl shadow-2xl relative z-10 backdrop-blur-md ${theme === 'dark' ? 'bg-gray-800/80' : 'bg-white'
                    }`}
            >
                <motion.div variants={childVariants} className="text-center mb-8">
                    <h1
                        className={`text-3xl font-bold flex items-center justify-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'
                            }`}
                    >
                        <FaUserPlus className="mr-2 text-purple-500" />
                        Sign Up
                    </h1>
                    <p
                        className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                            }`}
                    >
                        Create an account to start creating quizzes
                    </p>
                </motion.div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <motion.div variants={childVariants}>
                            <label
                                htmlFor="firstname"
                                className={`block mb-2 font-medium flex items-center ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                    }`}
                            >
                                <FaUser className="mr-2 text-blue-500" />
                                First Name
                            </label>
                            <motion.input
                                type="text"
                                id="firstname"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 rounded-lg border ${formErrors.firstname
                                        ? 'border-red-500'
                                        : theme === 'dark'
                                            ? 'border-gray-600 bg-gray-700 text-white'
                                            : 'border-gray-300'
                                    } focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300`}
                                placeholder="First name"
                                whileFocus={{ scale: 1.02 }}
                            />
                        </motion.div>

                        <motion.div variants={childVariants}>
                            <label
                                htmlFor="lastname"
                                className={`block mb-2 font-medium flex items-center ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                    }`}
                            >
                                <FaUser className="mr-2 text-blue-500" />
                                Last Name
                            </label>
                            <motion.input
                                type="text"
                                id="lastname"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 rounded-lg border ${formErrors.lastname
                                        ? 'border-red-500'
                                        : theme === 'dark'
                                            ? 'border-gray-600 bg-gray-700 text-white'
                                            : 'border-gray-300'
                                    } focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300`}
                                placeholder="Last name"
                                whileFocus={{ scale: 1.02 }}
                            />
                        </motion.div>
                    </div>

                    <motion.div variants={childVariants} className="mb-4">
                        <label
                            htmlFor="username"
                            className={`block mb-2 font-medium flex items-center ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                }`}
                        >
                            <FaEnvelope className="mr-2 text-pink-500" />
                            Email
                        </label>
                        <motion.input
                            type="email"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 rounded-lg border ${formErrors.username
                                    ? 'border-red-500'
                                    : theme === 'dark'
                                        ? 'border-gray-600 bg-gray-700 text-white'
                                        : 'border-gray-300'
                                } focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300`}
                            placeholder="Enter your email"
                            whileFocus={{ scale: 1.02 }}
                        />
                    </motion.div>

                    <motion.div variants={childVariants} className="mb-6">
                        <label
                            htmlFor="password"
                            className={`block mb-2 font-medium flex items-center ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                }`}
                        >
                            <FaLock className="mr-2 text-pink-500" />
                            Password
                        </label>
                        <motion.input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 rounded-lg border ${formErrors.password
                                    ? 'border-red-500'
                                    : theme === 'dark'
                                        ? 'border-gray-600 bg-gray-700 text-white'
                                        : 'border-gray-300'
                                } focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300`}
                            placeholder="Create a password"
                            whileFocus={{ scale: 1.02 }}
                        />
                    </motion.div>

                    <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        variants={childVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full py-3 px-4 rounded-lg font-medium text-white ${isSubmitting
                                ? 'bg-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                            } transition-colors duration-300 shadow-lg`}
                    >
                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </motion.button>
                </form>

                <motion.div
                    variants={childVariants}
                    className="mt-6 text-center"
                >
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className={`font-medium ${theme === 'dark'
                                    ? 'text-purple-400 hover:text-purple-300'
                                    : 'text-blue-600 hover:text-blue-700'
                                } transition-colors duration-300`}
                        >
                            Login
                        </Link>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Signup;