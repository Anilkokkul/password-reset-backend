# Password Reset Flow Backend

## Overview

This project serves as the backend for handling password reset functionality in a web application. It provides a secure and user-friendly mechanism for users to reset their passwords in case they forget them.

## Features

- **Password Reset Token Generation**: Generate unique and secure tokens for password reset requests.
- **Token Expiry**: Set expiration time for password reset tokens to enhance security.
- **Email Integration**: Send password reset instructions to users via email.
- **User Verification**: Verify the authenticity of password reset requests.
- **Password Update**: Allow users to securely update their passwords.

## Technologies Used

- **Node.js**: Server-side JavaScript runtime for building scalable network applications.
- **Express**: Web application framework for Node.js.
- **MongoDB**: NoSQL database for storing user information and password reset tokens.
- **JWT (JSON Web Tokens)**: Secure way to transmit information between parties as a JSON object.
- **Nodemailer**: Module for sending emails from Node.js applications.

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB database

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Anilkokkul/password-reset-backend.git
   ```
