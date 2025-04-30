# TestPrep

TestPrep is a web application designed to help users prepare for exams by providing a platform to take mock tests, track progress, and learn from AI-powered recommendations.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [License](#license)

---

## Features

- **User Authentication**: Secure login and signup functionality.
- **Mock Tests**: Take mock tests and track your performance.
- **AI-Powered Learning**: Get personalized recommendations based on your test results.
- **Responsive Design**: Fully responsive UI built with TailwindCSS and DaisyUI.
- **Admin Features**: Manage users, tests, and content.

---

## Tech Stack

### Frontend
- **Framework**: React (with Vite)
- **Styling**: TailwindCSS, DaisyUI
- **State Management**: Context API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **AI Integration**: Groq API

### Deployment
- **Containerization**: Docker
- **Cloud**: AWS (EC2, CloudFormation)

---

## Project Structure

GitHub Copilot
Here’s the updated content for your README.md file:

TestPrep/ ├── backend/ # Backend code (Node.js, Express) │ ├── config/ # Configuration files │ ├── middleware/ # Middleware for request handling │ ├── models/ # MongoDB models │ ├── routes/ # API routes │ ├── scripts/ # Utility scripts │ ├── Dockerfile # Docker configuration for backend │ └── index.js # Entry point for backend ├── frontend/ # Frontend code (React, Vite) │ ├── public/ # Static assets │ ├── src/ # React components and pages │ ├── Dockerfile # Docker configuration for frontend │ └── vite.config.js # Vite configuration ├── data/ # MongoDB backups ├── infrastructure/ # Infrastructure as code (Terraform, CloudFormation) └── .github/ # GitHub Actions workflows

---

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- Docker
- MongoDB
- AWS CLI (for deployment)

### Backend Setup
