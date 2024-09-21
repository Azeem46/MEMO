# MEMO: A Full-Stack Blog Website

## Overview

**MEMO** is a feature-rich blog platform built using the MERN stack and Redux for state management. It allows users to create, share, and engage with blog posts in an intuitive and mobile-responsive environment.

## Key Features

### User Authentication

- **Login and Registration:** Secure user authentication to access platform features and Secure login and registration using JWT (JSON Web Tokens)

### Profile Page

- Users can view their created posts and the total number of posts.
- Bookmark favorite posts for easy access.

### Homepage

- A dynamic feed displaying all posts.
- Click the "Create" button to initiate the post creation process.

### Post Creation

- Users can create posts with:
  - Title
  - Message
  - Tags
  - Images
- After creating a post, users have options to update or delete it.

### Post Visibility

- Non-users can view all public posts.
- Users can like posts and bookmark post and access detailed views by clicking on post cards.

### Comments

- Users can comment on posts and have the ability to edit or delete their comments.

### Trending and Latest Pages

- Explore trending and latest posts to stay updated with popular content.

### Mobile Responsive

- The entire application is designed to provide an optimal experience on mobile devices.

## Technology Stack

- **MongoDB:** NoSQL database for flexible data storage and retrieval.
- **Express.js:** Backend framework for building robust APIs and handling server-side logic.
- **React:** Frontend library for creating interactive user interfaces.
- **Node.js:** JavaScript runtime for executing server-side code.
- **Redux:** State management library for predictable state container.

## Getting Started

### Prerequisites

- Node.js (version x.x.x)
- MongoDB (version x.x.x)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/memo.git
   cd memo
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   - Create a `.env` file in the root directory and add the necessary configuration (e.g., database URL, JWT secret).

4. **Run the application:**
   ```bash
   npm run dev
   ```

## Usage

- Open your browser and navigate to `http://localhost:5173` to access the application.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or fixes.
