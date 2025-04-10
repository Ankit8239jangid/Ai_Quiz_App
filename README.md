# Quiz Application [Live preview](https://ai-quiz-by-ankit.vercel.app/)

A full-stack quiz application with AI-generated quizzes, user authentication, and a modern UI with dark mode support.

## Project Overview

This Quiz Application is a comprehensive platform that allows users to create, take, and manage quizzes on various topics. The application features a modern UI with dark mode support, user authentication, and the ability to generate quizzes using AI.

![Quiz Application](https://via.placeholder.com/800x400?text=Quiz+Application)

## Features

- **User Authentication**: Secure signup and login functionality
- **User Profile**: View and edit profile information with profile picture
- **Dashboard**: Track quiz progress, view statistics, and manage quizzes
- **Create Quizzes**: Create custom quizzes with multiple-choice questions
- **AI-Generated Quizzes**: Generate quizzes using AI based on prompts
- **Take Quizzes**: Attempt quizzes with a timer and get instant results
- **Quiz Management**: Edit, delete, and view quizzes
- **Progress Tracking**: Track quiz attempts and scores
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Toast Notifications**: Display success and error messages

## Tech Stack

### Frontend
- React
- React Router
- Axios
- React Hot Toast
- React Icons
- Tailwind CSS
- Framer Motion
- Vite

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication
- Google AI API (for quiz generation)

## Project Structure

The project is organized into two main directories:

- **Frontend**: Contains the React application
- **backend**: Contains the Express API server

Each directory has its own README.md with detailed information about its structure, components, and functionality.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/quiz-application.git
   cd quiz-application
   ```

2. Install backend dependencies
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies
   ```bash
   cd ../Frontend
   npm install
   ```

4. Create environment variables:

   For backend (.env in backend directory):
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/quiz-app
   JWT_SECRET=your_jwt_secret
   GOOGLE_API_KEY=your_google_api_key
   ```

   For frontend (.env in Frontend directory):
   ```
   VITE_BACKEND_URL=http://localhost:5000/api
   ```

5. Start the backend server
   ```bash
   cd backend
   npm start
   ```

6. Start the frontend development server
   ```bash
   cd ../Frontend
   npm run dev
   ```

7. Open your browser and navigate to `http://localhost:5173`

## Documentation

- [Frontend Documentation](./Frontend/README.md)
- [Backend API Documentation](./backend/README.md)

## Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400?text=Dashboard)

### Quiz Creation
![Quiz Creation](https://via.placeholder.com/800x400?text=Quiz+Creation)

### AI Quiz Generation
![AI Quiz Generation](https://via.placeholder.com/800x400?text=AI+Quiz+Generation)

### Taking a Quiz
![Taking a Quiz](https://via.placeholder.com/800x400?text=Taking+a+Quiz)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Google AI](https://ai.google.dev/)
