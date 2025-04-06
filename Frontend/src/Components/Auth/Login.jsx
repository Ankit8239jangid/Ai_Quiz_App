import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/auth.context';
import { useAppContext } from '../../context/app.context';
import { FaUser, FaLock, FaSignInAlt, FaBrain, FaLightbulb, FaPuzzlePiece } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const { theme } = useAppContext();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: ''
            });
        }
    };

    const validateForm = () => {
        const errors = {};

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
            const result = await login(formData);

            if (result.success) {
                navigate('/app/dashboard');
            } else {
                toast.error(result.message);
                setFormErrors({ general: result.message });
            }
        } catch (error) {
            const errorMessage = 'Login failed. Please try again.';
            toast.error(errorMessage);
            setFormErrors({ general: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`  min-h-screen flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-100 to-purple-100'}`}>
            <motion.div 
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`max-w-md w-full p-8 rounded-lg shadow-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
            >
                <div className="text-center mb-8">
                    <motion.h1 
                        className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <FaSignInAlt className="inline-block mr-2 mb-1 text-indigo-500" />
                        AI Quiz Login
                    </motion.h1>
                    <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Unlock your knowledge adventure
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div 
                        className="mb-4"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <label
                            htmlFor="username"
                            className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
                        >
                            <FaUser className="inline-block mr-2 mb-1 text-indigo-500" />
                            Email
                        </label>
                        <input
                            type="email"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 rounded-lg border ${formErrors.username ? 'border-red-500' : theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300`}
                            placeholder="Enter your email"
                        />
                    </motion.div>

                    <motion.div 
                        className="mb-6"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <label
                            htmlFor="password"
                            className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
                        >
                            <FaLock className="inline-block mr-2 mb-1 text-indigo-500" />
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 rounded-lg border ${formErrors.password ? 'border-red-500' : theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300`}
                            placeholder="Enter your password"
                        />
                    </motion.div>

                    <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-4 rounded-lg font-medium text-white ${isSubmitting ? 'bg-gray-500 cursor-not-allowed' : theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'} transition-colors duration-300 transform hover:scale-105`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </motion.button>
                </form>

                <div className="mt-8 text-center">
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                        Don't have an account?{' '}
                        <Link
                            to="/signup"
                            className={`font-medium ${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'} transition-colors duration-300`}
                        >
                            Sign up
                        </Link>
                    </p>
                </div>

                <div className="mt-8 flex justify-center space-x-4">
                    <motion.div whileHover={{ scale: 1.1 }} className="text-indigo-500">
                        <FaBrain size={24} />
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} className="text-indigo-500">
                        <FaLightbulb size={24} />
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} className="text-indigo-500">
                        <FaPuzzlePiece size={24} />
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
