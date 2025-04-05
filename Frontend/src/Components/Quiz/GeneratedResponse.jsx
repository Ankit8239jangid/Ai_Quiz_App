import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../../context/app.context';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaSpinner, FaRobot, FaClipboard } from 'react-icons/fa';

const GeneratedResponse = () => {
    const { id } = useParams();
    const { theme } = useAppContext();
    
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchGeneratedResponse = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Authentication required');
                    setLoading(false);
                    return;
                }
                
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/quiz/generate-response/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                
                if (response.data.success) {
                    setResponse(response.data.generatedResponse);
                } else {
                    setError('Failed to fetch generated response');
                }
            } catch (error) {
                console.error('Error fetching generated response:', error);
                setError('Failed to fetch generated response. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        
        if (id) {
            fetchGeneratedResponse();
        }
    }, [id]);
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(response)
            .then(() => {
                toast.success('Response copied to clipboard!');
            })
            .catch(() => {
                toast.error('Failed to copy response');
            });
    };
    
    if (loading) {
        return (
            <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} mb-6`}>
                <div className="flex items-center justify-center py-8">
                    <FaSpinner className={`animate-spin text-3xl ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                    <span className="ml-3 text-lg">Generating response...</span>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} mb-6`}>
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-red-900/20 border border-red-800 text-red-300' : 'bg-red-50 border border-red-200 text-red-600'}`}>
                    <p>{error}</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} mb-6`}>
            <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-bold flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    <FaRobot className="mr-2" />
                    Generated Response
                </h2>
                <button
                    onClick={copyToClipboard}
                    className={`p-2 rounded-lg flex items-center ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                    title="Copy to clipboard"
                >
                    <FaClipboard className="mr-2" />
                    Copy
                </button>
            </div>
            
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={`whitespace-pre-line ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    {response}
                </p>
            </div>
        </div>
    );
};

export default GeneratedResponse;
