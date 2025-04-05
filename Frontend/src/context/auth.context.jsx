import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Set the base URL for API requests
const API_URL = import.meta.env.VITE_BACKEND_URL;

// Create the context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
    // State management
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper function to clear auth state
    const handleLogout = () => {
        // Clear state
        setCurrentUser(null);
        setToken(null);

        // Clear localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');

        // Clear auth header
        delete axios.defaults.headers.common['Authorization'];
    };



    // Initialize auth state from localStorage
    useEffect(() => {
        const initializeAuth = async () => {
            setLoading(true);
            const storedUser = localStorage.getItem('user');
            const storedToken = localStorage.getItem('token');

            if (storedUser && storedToken) {
                try {
                    // Set default auth header for all requests
                    axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

                    // Verify token is still valid by fetching user profile
                    const response = await axios.get(`${API_URL}/user/profile`);

                    if (response.data.success) {
                        setCurrentUser(response.data.user);
                        setToken(storedToken);

                        // Update stored user data with latest from server
                        localStorage.setItem('user', JSON.stringify(response.data.user));
                    } else {
                        // Token is invalid, clear auth state
                        handleLogout();
                    }
                } catch (error) {
                    console.error('Error verifying authentication:', error);
                    // Token is invalid or expired, clear auth state
                    handleLogout();
                }
            }

            setLoading(false);
        };

        initializeAuth();
    }, []);

    // Register a new user
    const register = async (userData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.post(`${API_URL}/user/signup`, userData);

            const { token, user } = response.data;

            // Save to state
            setCurrentUser(user);
            setToken(token);

            // Save to localStorage
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);

            // Set default auth header for all requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Show success toast
            toast.success('Registration successful!');

            return { success: true, user };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            setError(message);

            // Show error toast
            toast.error(message);

            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    // Login user
    const login = async (credentials) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.post(`${API_URL}/user/login`, credentials);

            const { token, user } = response.data;

            // Save to state
            setCurrentUser(user);
            setToken(token);

            // Save to localStorage
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);

            // Set default auth header for all requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Show success toast
            toast.success('Login successful!');

            return { success: true, user };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            setError(message);

            // Show error toast
            toast.error(message);

            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    // Logout user
    const logout = () => {
        handleLogout();
        // Show logout toast
        toast.success('Logged out successfully');
        // Redirect to login page or home page can be handled by the component that calls this function
    };

    // Update user profile
    const updateProfile = async (userData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.put(
                `${API_URL}/user/profile`,
                userData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const { user } = response.data;

            // Update state
            setCurrentUser(user);

            // Update localStorage
            localStorage.setItem('user', JSON.stringify(user));

            // Show success toast
            toast.success('Profile updated successfully!');

            return { success: true, user };
        } catch (error) {
            const message = error.response?.data?.message || 'Profile update failed';
            setError(message);

            // Show error toast
            toast.error(message);

            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        if (token) {
            return true;
        } else {
            return false;
        }
    };

    // Values to be shared across components
    const value = {
        currentUser,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        isAuthenticated
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
