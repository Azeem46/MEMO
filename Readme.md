# MEMO: A Full-Stack Blog Application

![Build Status](https://img.shields.io/badge/build-passing-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue)

## Description

**MEMO** is a feature-rich blog platform built using the MERN stack (MongoDB, Express.js, React, and Node.js) and Redux for state management. Designed for both novice and seasoned bloggers, MEMO allows users to create, share, and engage with blog content seamlessly.

## Table of Contents

- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Key Features

- Secure user authentication with JWT.
- Profile management to view created posts and bookmarks.
- Dynamic homepage displaying all posts.
- Post creation with titles, messages, tags, and images.
- Commenting system with edit and delete options.
- Trending and latest posts pages.
- Fully mobile-responsive design.

## Technology Stack

- **Frontend:** React, Redux
- **Backend:** Node.js, Express.js
- **Database:** MongoDB

## Getting Started

### Prerequisites

- Node.js (version x.x.x)
- MongoDB (version x.x.x)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/memo.git
   cd memo
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your environment variables:

   - Create a `.env` file and configure it (e.g., database URL, JWT secret).

4. Run the application:
   ```bash
   npm run dev
   ```

## Usage

- Open your browser and navigate to `http://localhost:3000` to access the application.
- Follow the on-screen instructions for creating an account and managing posts.

## API Documentation

### Authentication

### Register

**Endpoint:** `POST /user/signup`

**Request Body:**

```json
{
  "name": "Azeem",
  "email": "azeem@gmail.com",
  "password": "Password1!"
}
```

**Response:**

```json
{
  "result": {
    "name": "Azeem1",
    "email": "azeem@gmail.com",
    "password": "$2a$12$C9YnXFCZmgtFG7gA4qqBPuIbv/31ADTHfEXXxt/a4I2sKNOlklx1e",
    "postCount": 0,
    "_id": "66eee0c3645adca5b3741976",
    "joinDate": "2024-09-21T15:05:39.625Z",
    "__v": 0
  }
}
```

## Login

**Endpoint:** `POST /user/signin`

**Request Body:**

```json
{
  "email": "azeem@gmail.com",
  "password": "Password1!"
}
```

**Response:**

```json
{
  "message": "User signed in successfully",
  "user": {
    "email": "azeem@gmail.com",
    "id": "66eee0c3645adca5b3741976",
    "name": "Azeem1",
    "joinDate": "2024-09-21T15:05:39.625Z",
    "postCount": 0,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImF6ZWVtQGdtYWlsLmNvbSIsImlkIjoiNjZlZWUwYzM2NDVhZGNhNWIzNzQxOTc2IiwiaWF0IjoxNzI2OTMxMjE2LCJleHAiOjE3NTg0ODg4MTZ9.MJtPBvzndFmPsV4I5ZMFt_A3srCbNYEgi47u0d5ZIWo"
  }
}
```

### Posts

- **GET /api/posts**
  - Response: List of posts
- **POST /api/posts**
  - Request body: `{ title, message, tags, images }`
  - Response: Created post object

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or fixes. Ensure to follow the project's coding standards.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Special thanks to the developers and communities behind the MERN stack and Redux for their contributions and support.
