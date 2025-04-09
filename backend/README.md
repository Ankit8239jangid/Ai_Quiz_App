# Quiz Application API Documentation

This document provides detailed information about the API endpoints available in the Quiz Application backend.

## Table of Contents

1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Quiz Management](#quiz-management)
4. [Quiz Progress](#quiz-progress)
5. [Error Handling](#error-handling)

## Base URL

All API endpoints are relative to the base URL:

```
http://localhost:3000/api/v1
```

## Authentication

Most endpoints require authentication using a JWT token. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

### Authentication Endpoints

#### Register a new user

```
POST /user/signup
```

**Request Body:**
```json
{
  "username": "user@example.com",
  "password": "password123",
  "firstname": "John",
  "lastname": "Doe"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "username": "user@example.com",
    "firstname": "John",
    "lastname": "Doe"
  }
}
```

#### Login

```
POST /user/login
```

**Request Body:**
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "username": "user@example.com",
    "firstname": "John",
    "lastname": "Doe"
  }
}
```

## User Management

### User Endpoints

#### Get User Profile

```
GET /user/profile
```

**Headers:**
```
Authorization: Bearer <your_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "username": "user@example.com",
    "firstname": "John",
    "lastname": "Doe",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Update User Profile

```
PUT /user/profile
```

**Headers:**
```
Authorization: Bearer <your_token>
```

**Request Body:**
```json
{
  "firstname": "Johnny",
  "lastname": "Doe"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "username": "user@example.com",
    "firstname": "Johnny",
    "lastname": "Doe",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-02T00:00:00.000Z"
  }
}
```

## Quiz Management

### Quiz Endpoints

#### Create a New Quiz

```
POST /quiz/create
```

**Headers:**
```
Authorization: Bearer <your_token>
```

**Request Body:**
```json
{
  "title": "JavaScript Basics",
  "field": "Programming",
  "timeLimit": 10,
  "questions": [
    {
      "question": "What is JavaScript?",
      "options": [
        "A programming language",
        "A markup language",
        "A database",
        "An operating system"
      ],
      "correctAnswer": "A programming language"
    },
    {
      "question": "Which keyword is used to declare variables in JavaScript?",
      "options": [
        "var",
        "let",
        "const",
        "All of the above"
      ],
      "correctAnswer": "All of the above"
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Quiz created successfully",
  "quiz": {
    "_id": "60d21b4667d0d8992e610c85",
    "title": "JavaScript Basics",
    "field": "Programming",
    "timeLimit": 10,
    "numQuestions": 2,
    "createdBy": "60d21b4667d0d8992e610c85",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Generate AI Quiz

```
POST /quiz/generate-ai-quiz
```

**Headers:**
```
Authorization: Bearer <your_token>
```

**Request Body:**
```json
{
  "prompt": "Create a quiz about the solar system",
  "field": "Astronomy",
  "numQuestions": 5
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Quiz generated and saved successfully",
  "quiz": {
    "_id": "60d21b4667d0d8992e610c85",
    "title": "Solar System Quiz",
    "field": "Astronomy",
    "timeLimit": 10,
    "numQuestions": 5,
    "createdBy": "60d21b4667d0d8992e610c85",
    "generatedResponse": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Get All Quizzes

```
GET /quiz/all_quiz
```

**Response (200 OK):**
```json
{
  "success": true,
  "quizzes": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "title": "JavaScript Basics",
      "field": "Programming",
      "timeLimit": 10,
      "numQuestions": 2,
      "createdBy": "60d21b4667d0d8992e610c85",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    {
      "_id": "60d21b4667d0d8992e610c86",
      "title": "Solar System Quiz",
      "field": "Astronomy",
      "timeLimit": 10,
      "numQuestions": 5,
      "createdBy": "60d21b4667d0d8992e610c85",
      "generatedResponse": true,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get My Quizzes

```
GET /quiz/my-quizzes
```

**Headers:**
```
Authorization: Bearer <your_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "quizzes": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "title": "JavaScript Basics",
      "field": "Programming",
      "timeLimit": 10,
      "numQuestions": 2,
      "createdBy": "60d21b4667d0d8992e610c85",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Quiz by ID

```
GET /quiz/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "quiz": {
    "_id": "60d21b4667d0d8992e610c85",
    "title": "JavaScript Basics",
    "field": "Programming",
    "timeLimit": 10,
    "numQuestions": 2,
    "questions": [
      {
        "question": "What is JavaScript?",
        "options": [
          "A programming language",
          "A markup language",
          "A database",
          "An operating system"
        ]
      },
      {
        "question": "Which keyword is used to declare variables in JavaScript?",
        "options": [
          "var",
          "let",
          "const",
          "All of the above"
        ]
      }
    ],
    "createdBy": "60d21b4667d0d8992e610c85",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Get Quiz with Answers (for creator only)

```
GET /quiz/with-answers/:id
```

**Headers:**
```
Authorization: Bearer <your_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "quiz": {
    "_id": "60d21b4667d0d8992e610c85",
    "title": "JavaScript Basics",
    "field": "Programming",
    "timeLimit": 10,
    "numQuestions": 2,
    "questions": [
      {
        "question": "What is JavaScript?",
        "options": [
          "A programming language",
          "A markup language",
          "A database",
          "An operating system"
        ],
        "correctAnswer": "A programming language"
      },
      {
        "question": "Which keyword is used to declare variables in JavaScript?",
        "options": [
          "var",
          "let",
          "const",
          "All of the above"
        ],
        "correctAnswer": "All of the above"
      }
    ],
    "createdBy": "60d21b4667d0d8992e610c85",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Update Quiz

```
PUT /quiz/update/:id
```

**Headers:**
```
Authorization: Bearer <your_token>
```

**Request Body:**
```json
{
  "title": "JavaScript Fundamentals",
  "field": "Programming",
  "timeLimit": 15
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Quiz updated successfully",
  "quiz": {
    "_id": "60d21b4667d0d8992e610c85",
    "title": "JavaScript Fundamentals",
    "field": "Programming",
    "timeLimit": 15,
    "numQuestions": 2,
    "createdBy": "60d21b4667d0d8992e610c85",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-02T00:00:00.000Z"
  }
}
```

#### Delete Quiz

```
DELETE /quiz/delete/:id
```

**Headers:**
```
Authorization: Bearer <your_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Quiz deleted successfully"
}
```

#### Get Common Fields

```
GET /quiz/fields
```

**Response (200 OK):**
```json
{
  "success": true,
  "fields": [
    "Programming",
    "Astronomy",
    "Mathematics",
    "History",
    "Science"
  ]
}
```

## Quiz Progress

### Progress Endpoints

#### Submit Quiz Answers

```
POST /progress/submit
```

**Headers:**
```
Authorization: Bearer <your_token>
```

**Request Body:**
```json
{
  "quizId": "60d21b4667d0d8992e610c85",
  "userAnswers": [
    "A programming language",
    "All of the above"
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Quiz submitted successfully",
  "result": {
    "score": 100,
    "totalQuestions": 2,
    "correctAnswers": 2
  },
  "progress": {
    "_id": "60d21b4667d0d8992e610c87",
    "userId": "60d21b4667d0d8992e610c85",
    "quizId": "60d21b4667d0d8992e610c85",
    "score": 100,
    "attemptedAt": "2023-01-02T00:00:00.000Z"
  }
}
```

#### Get User Progress

```
GET /progress
```

**Headers:**
```
Authorization: Bearer <your_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "progress": [
    {
      "_id": "60d21b4667d0d8992e610c87",
      "userId": "60d21b4667d0d8992e610c85",
      "quizId": {
        "_id": "60d21b4667d0d8992e610c85",
        "title": "JavaScript Fundamentals",
        "field": "Programming",
        "numQuestions": 2,
        "timeLimit": 15
      },
      "score": 100,
      "attemptedAt": "2023-01-02T00:00:00.000Z"
    }
  ]
}
```

#### Get Progress for a Specific Quiz

```
GET /progress/:quizId
```

**Headers:**
```
Authorization: Bearer <your_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "progress": {
    "_id": "60d21b4667d0d8992e610c87",
    "userId": "60d21b4667d0d8992e610c85",
    "quizId": {
      "_id": "60d21b4667d0d8992e610c85",
      "title": "JavaScript Fundamentals",
      "field": "Programming",
      "numQuestions": 2,
      "timeLimit": 15
    },
    "score": 100,
    "attemptedAt": "2023-01-02T00:00:00.000Z"
  }
}
```

#### Get User Statistics Summary

```
GET /progress/stats/summary
```

**Headers:**
```
Authorization: Bearer <your_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "stats": {
    "totalQuizzes": 5,
    "completedQuizzes": 3,
    "averageScore": 85,
    "highestScore": 100,
    "recentAttempts": [
      {
        "_id": "60d21b4667d0d8992e610c87",
        "quizId": {
          "_id": "60d21b4667d0d8992e610c85",
          "title": "JavaScript Fundamentals",
          "field": "Programming"
        },
        "score": 100,
        "attemptedAt": "2023-01-02T00:00:00.000Z"
      }
    ]
  }
}
```

#### Get Dashboard Data (Combined Endpoint)

```
GET /progress/dashboard-data
```

**Headers:**
```
Authorization: Bearer <your_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "dashboardData": {
    "stats": {
      "totalQuizzes": 2,
      "totalAttempts": 3,
      "completedQuizzes": 3,
      "averageScore": 85,
      "highestScore": 100
    },
    "quizzes": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "title": "JavaScript Fundamentals",
        "field": "Programming",
        "timeLimit": 15,
        "numQuestions": 2,
        "createdBy": "60d21b4667d0d8992e610c85",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-02T00:00:00.000Z"
      }
    ],
    "recentAttempts": [
      {
        "_id": "60d21b4667d0d8992e610c87",
        "quizId": {
          "_id": "60d21b4667d0d8992e610c85",
          "title": "JavaScript Fundamentals",
          "field": "Programming"
        },
        "score": 100,
        "attemptedAt": "2023-01-02T00:00:00.000Z"
      }
    ]
  }
}
```

#### Set Reminder for a Quiz

```
POST /progress/reminder/:quizId
```

**Headers:**
```
Authorization: Bearer <your_token>
```

**Request Body:**
```json
{
  "reminderTime": "2023-01-10T15:00:00.000Z"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Reminder set successfully",
  "progress": {
    "_id": "60d21b4667d0d8992e610c87",
    "userId": "60d21b4667d0d8992e610c85",
    "quizId": "60d21b4667d0d8992e610c85",
    "createReminder": true,
    "reminderTime": "2023-01-10T15:00:00.000Z"
  }
}
```

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "error": "Detailed error information (optional)"
}
```

### Common HTTP Status Codes

- **200 OK**: Request succeeded
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request parameters
- **401 Unauthorized**: Authentication required or failed
- **403 Forbidden**: Authenticated but not authorized
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side error

## Authentication Errors

### Invalid Credentials

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### Missing Token

```json
{
  "success": false,
  "message": "Authentication required. Please provide a valid token."
}
```

### Invalid Token

```json
{
  "success": false,
  "message": "Invalid token. Please login again."
}
```

## Resource Errors

### Resource Not Found

```json
{
  "success": false,
  "message": "Quiz not found"
}
```

### Permission Error

```json
{
  "success": false,
  "message": "You don't have permission to access this resource"
}
```

### Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "error": "Title is required"
}
```
