# Quiz Application Frontend

A modern, responsive quiz application built with React, featuring AI-generated quizzes, user authentication, and a sleek UI with dark mode support.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Key Components](#key-components)
- [Styling](#styling)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Authentication](#authentication)
- [Contributing](#contributing)

## Overview

This Quiz Application allows users to create, take, and manage quizzes on various topics. The application features a modern UI with dark mode support, user authentication, and the ability to generate quizzes using AI.

## Features

### User Features
- **User Authentication**: Secure signup and login functionality
- **User Profile**: View and edit profile information with profile picture
- **Dashboard**: Track quiz progress, view statistics, and manage quizzes
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing

### Quiz Features
- **Create Quizzes**: Create custom quizzes with multiple-choice questions
- **AI-Generated Quizzes**: Generate quizzes using AI based on prompts
- **Take Quizzes**: Attempt quizzes with a timer and get instant results
- **Quiz Management**: Edit, delete, and view quizzes
- **Progress Tracking**: Track quiz attempts and scores
- **Filtering**: Filter quizzes by category/field

### UI/UX Features
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Toast Notifications**: Display success and error messages using react-hot-toast
- **Loading States**: Skeleton loaders and loading indicators for better UX
- **Confirmation Dialogs**: Confirm destructive actions like deleting quizzes

## Project Structure

```
Frontend/
├── public/              # Public assets
├── src/
│   ├── Components/      # React components
│   │   ├── Auth/        # Authentication components
│   │   ├── Dashboard/   # Dashboard components
│   │   ├── Quiz/        # Quiz-related components
│   │   ├── Browse Quizzes/ # Quiz browsing components
│   │   ├── Common/      # Reusable components
│   │   └── Sidebar/     # Sidebar navigation
│   ├── context/         # React context providers
│   ├── Layout/          # Layout components
│   ├── assets/          # Static assets
│   ├── App.jsx          # Main application component
│   ├── index.jsx        # Entry point
│   └── main.jsx         # React rendering
└── package.json         # Dependencies and scripts
```

## Technologies Used

- **React**: Frontend library for building user interfaces
- **React Router**: For navigation and routing
- **Axios**: For API requests
- **React Hot Toast**: For toast notifications
- **React Icons**: For UI icons
- **Tailwind CSS**: For styling
- **Framer Motion**: For animations
- **Vite**: Build tool and development server

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/quiz-application.git
   cd quiz-application/Frontend
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the Frontend directory with the following content:
   ```
   VITE_BACKEND_URL=http://localhost:5000/api
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Key Components

### Authentication Components

- **Login.jsx**: Handles user login
- **Signup.jsx**: Handles user registration
- **Profile.jsx**: Displays and allows editing of user profile

### Quiz Components

- **CreateQuiz.jsx**: Form for creating custom quizzes
- **AIQuizGenerator.jsx**: Interface for generating quizzes using AI
- **QuizTest.jsx**: Component for taking quizzes
- **EditQuiz.jsx**: Form for editing existing quizzes

### Dashboard Components

- **Dashboard.jsx**: Main dashboard showing statistics and user's quizzes
- **DashboardSkeleton.jsx**: Loading skeleton for the dashboard

### Navigation Components

- **Said_Bar.jsx**: Sidebar navigation component
- **Navbar.jsx**: Top navigation bar

### Common Components

- **DeleteConfirmation.jsx**: Reusable confirmation dialog for delete actions
- **Card.jsx**: Reusable card component for displaying quizzes
- **Button.jsx**: Styled button component

## Styling

The application uses Tailwind CSS for styling with a custom color scheme. The theme (light/dark mode) is managed through the app context and applied using Tailwind's dark mode classes.

### Theme Colors

- **Primary**: Indigo (#4F46E5)
- **Secondary**: Purple (#7C3AED)
- **Accent**: Blue (#3B82F6)
- **Background (Light)**: White (#FFFFFF)
- **Background (Dark)**: Gray (#111827)
- **Text (Light)**: Gray (#1F2937)
- **Text (Dark)**: White (#FFFFFF)

## State Management

The application uses React Context API for state management:

- **auth.context.jsx**: Manages authentication state and user information
- **app.context.jsx**: Manages application-wide state like theme, quizzes, and UI state

## API Integration

The frontend communicates with the backend API using Axios. API calls are organized by feature:

- **Authentication**: User signup, login, and profile management
- **Quizzes**: CRUD operations for quizzes
- **Progress**: Tracking quiz attempts and scores

## Authentication

Authentication is handled using JWT (JSON Web Tokens):

1. User logs in or signs up
2. Backend returns a JWT token
3. Token is stored in localStorage
4. Token is included in the Authorization header for authenticated requests
5. Auth context provides user information and authentication status to components

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



