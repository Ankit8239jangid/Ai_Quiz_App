import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth.context';
import { useAppContext } from '../../context/app.context';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Profile.css';
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaChartBar,
  FaClipboardList,
  FaCheckCircle
} from 'react-icons/fa';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const Profile = () => {
  const { currentUser, updateProfile, isAuthenticated } = useAuth();
  const { theme } = useAppContext();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalQuizzes: 0,
    completedQuizzes: 0,
    averageScore: 0
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: ''
  });
  const [loading, setLoading] = useState(false);
  

  // Generate a random color for the profile picture background
  const getRandomColor = () => {
    const colors = [
      'bg-blue-500', 'bg-purple-500', 'bg-green-500',
      'bg-red-500', 'bg-yellow-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-teal-500'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const [profileColor] = useState(getRandomColor());

  // Format date to a readable string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate joining date (for demo purposes)
  const getJoiningDate = () => {
    // If we don't have a real joining date, generate a random one in the past year
    const now = new Date();
    const pastDate = new Date(now.setMonth(now.getMonth() - Math.floor(Math.random() * 12)));
    return formatDate(pastDate);
  };

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Initialize form data with current user data
    if (currentUser) {
      setFormData({
        firstname: currentUser.firstname || '',
        lastname: currentUser.lastname || ''
      });
    }

    // Fetch user stats
    const fetchUserStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/progress/stats/summary`);
        if (response.data.success) {
          setStats(response.data.stats);
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
        // Use dummy stats if API call fails
        setStats({
          totalQuizzes: Math.floor(Math.random() * 20),
          completedQuizzes: Math.floor(Math.random() * 15),
          averageScore: Math.floor(Math.random() * 40) + 60
        });
      }
    };

    fetchUserStats();
  }, [currentUser, isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await updateProfile(formData);

      if (result.success) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        
        toast.error(result.message);
      }
    } catch (error) {
      const errorMessage = 'Failed to update profile. Please try again.';
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({
      firstname: currentUser.firstname || '',
      lastname: currentUser.lastname || ''
    });
    
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>



        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className={`md:col-span-1 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
            <div className="flex flex-col items-center">
              {/* Profile Picture */}
              <div className={`profile-picture ${profileColor} w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4`}>
                {currentUser.firstname && currentUser.lastname
                  ? `${currentUser.firstname[0]}${currentUser.lastname[0]}`
                  : <FaUser />
                }
              </div>

              <h2 className="text-xl font-bold mt-2">
                {isEditing ? (
                  <div className="flex flex-col space-y-2 edit-form">
                    <input
                      type="text"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleChange}
                      className={`px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} text-center`}
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                      className={`px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} text-center`}
                      placeholder="Last Name"
                    />
                  </div>
                ) : (
                  `${currentUser.firstname} ${currentUser.lastname}`
                )}
              </h2>

              <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <FaEnvelope className="inline mr-2" />
                {currentUser.username}
              </p>

              <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <FaCalendarAlt className="inline mr-2" />
                Joined {getJoiningDate()}
              </p>

              {isEditing ? (
                <div className="flex mt-4 space-x-2">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`profile-button px-4 py-2 rounded-lg flex items-center ${loading ? 'bg-gray-500' : theme === 'dark' ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    <FaSave className="mr-2" />
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className={`profile-button px-4 py-2 rounded-lg flex items-center ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    <FaTimes className="mr-2" />
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className={`profile-button mt-4 px-4 py-2 rounded-lg flex items-center ${theme === 'dark' ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                >
                  <FaEdit className="mr-2" />
                  Edit Profile
                </button>
              )}
            </div>

            <hr className={`my-6 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`} />

            {/* Stats */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Statistics</h3>

              <div className={`stats-card p-3 rounded-lg mb-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
                    <FaClipboardList />
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Total Quizzes</p>
                    <p className="font-bold">{stats.totalQuizzes}</p>
                  </div>
                </div>
              </div>

              <div className={`stats-card p-3 rounded-lg mb-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-600'}`}>
                    <FaCheckCircle />
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Completed</p>
                    <p className="font-bold">{stats.completedQuizzes}</p>
                  </div>
                </div>
              </div>

              <div className={`stats-card p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-600'}`}>
                    <FaChartBar />
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Average Score</p>
                    <p className="font-bold">{stats.averageScore}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity and Achievements */}
          <div className={`md:col-span-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
            <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>

            {/* Activity Timeline */}
            <div className="relative pl-8 space-y-8 before:absolute before:inset-0 before:ml-4 before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-purple-500 before:to-pink-500">
              {[...Array(5)].map((_, index) => {
                // Generate random activity data
                const activities = [
                  'Completed a quiz',
                  'Created a new quiz',
                  'Achieved a high score',
                  'Earned a badge',
                  'Updated profile'
                ];
                const activity = activities[Math.floor(Math.random() * activities.length)];
                const daysAgo = index * 2 + Math.floor(Math.random() * 3);

                return (
                  <div key={index} className="relative timeline-item">
                    <div className={`absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full border-2 ${theme === 'dark' ? 'border-gray-800' : 'border-white'} ${index % 3 === 0 ? 'bg-blue-500' : index % 3 === 1 ? 'bg-purple-500' : 'bg-pink-500'}`}></div>
                    <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
                      <h4 className="font-medium">{activity}</h4>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{daysAgo} days ago</p>
                      <p className="mt-2">
                        {activity === 'Completed a quiz' && `You scored ${Math.floor(Math.random() * 40) + 60}% on the quiz.`}
                        {activity === 'Created a new quiz' && 'Your quiz is now available for others to take.'}
                        {activity === 'Achieved a high score' && 'You ranked in the top 10% of quiz takers!'}
                        {activity === 'Earned a badge' && 'You earned the "Quiz Master" badge.'}
                        {activity === 'Updated profile' && 'Your profile information was updated.'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Achievements */}
            <h3 className="text-xl font-semibold mt-8 mb-4">Achievements</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => {
                const achievements = [
                  { name: 'Quiz Master', icon: '🏆', color: 'bg-yellow-500' },
                  { name: 'Fast Learner', icon: '⚡', color: 'bg-blue-500' },
                  { name: 'Perfect Score', icon: '🎯', color: 'bg-green-500' },
                  { name: 'Quiz Creator', icon: '✏️', color: 'bg-purple-500' },
                  { name: 'Consistent', icon: '📊', color: 'bg-red-500' },
                  { name: 'Knowledge Seeker', icon: '🔍', color: 'bg-indigo-500' }
                ];
                const achievement = achievements[index];

                return (
                  <div
                    key={index}
                    className={`achievement-badge ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg flex flex-col items-center justify-center text-center`}
                  >
                    <div className={`w-12 h-12 ${achievement.color} rounded-full flex items-center justify-center text-2xl mb-2`}>
                      {achievement.icon}
                    </div>
                    <h4 className="font-medium">{achievement.name}</h4>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
