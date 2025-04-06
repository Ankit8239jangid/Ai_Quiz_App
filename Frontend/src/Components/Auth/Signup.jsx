import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/auth.context';
import { useAppContext } from '../../context/app.context';
import { FaUser, FaLock, FaEnvelope, FaUserPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        firstname: '',
        lastname: ''
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
            [name]: value
        });

        // Clear error when user types
        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: ''
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

        // Validate form
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);

            // Show first validation error as toast
            const firstError = Object.values(errors)[0];
            toast.error(firstError);
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await register(formData);

            if (result.success) {
                // Success is already handled by toast in auth context
                navigate('/app/dashboard');
            } else {
                // Show error toast
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

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <div className={`max-w-md w-full p-8 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="text-center mb-8">
                    <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        <FaUserPlus className="inline-block mr-2 mb-1" />
                        Sign Up
                    </h1>
                    <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Create an account to start creating quizzes
                    </p>
                </div>

                {/* Error messages are now shown as toast notifications */}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label
                                htmlFor="firstname"
                                className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
                            >
                                <FaUser className="inline-block mr-2 mb-1" />
                                First Name
                            </label>
                            <input
                                type="text"
                                id="firstname"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 rounded-lg border ${formErrors.firstname ? 'border-red-500' : theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary-light`}
                                placeholder="First name"
                            />
                            {/* Firstname error is now shown as toast */}
                        </div>

                        <div>
                            <label
                                htmlFor="lastname"
                                className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
                            >
                                <FaUser className="inline-block mr-2 mb-1" />
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="lastname"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 rounded-lg border ${formErrors.lastname ? 'border-red-500' : theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary-light`}
                                placeholder="Last name"
                            />
                            {/* Lastname error is now shown as toast */}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="username"
                            className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
                        >
                            <FaEnvelope className="inline-block mr-2 mb-1" />
                            Email
                        </label>
                        <input
                            type="email"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 rounded-lg border ${formErrors.username ? 'border-red-500' : theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary-light`}
                            placeholder="Enter your email"
                        />
                        {/* Username error is now shown as toast */}
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
                        >
                            <FaLock className="inline-block mr-2 mb-1" />
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 rounded-lg border ${formErrors.password ? 'border-red-500' : theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary-light`}
                            placeholder="Create a password"
                        />
                        {/* Password error is now shown as toast */}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-4 rounded-lg font-medium text-white ${isSubmitting ? 'bg-gray-500 cursor-not-allowed' : theme === 'dark' ? 'bg-primary-dark hover:bg-indigo-600' : 'bg-primary-light hover:bg-indigo-700'} transition-colors duration-300`}
                    >
                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className={`font-medium ${theme === 'dark' ? 'text-primary-dark hover:text-indigo-400' : 'text-primary-light hover:text-indigo-700'}`}
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
