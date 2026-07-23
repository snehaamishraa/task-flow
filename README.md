<div align="center">

# 🚀 TaskFlow

### Modern Full-Stack Task Management Platform

Organize • Prioritize • Track • Achieve

<img src="./public/dashboard-preview.png" width="900"/>

![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![Fiber](https://img.shields.io/badge/Fiber-2DBE60?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss)

</div>

---

# 📖 Overview

TaskFlow is a **modern full-stack task management application** designed to help users organize their work, manage priorities, and track progress efficiently.

Built with **Go Fiber** on the backend and **Next.js** on the frontend, TaskFlow focuses on clean architecture, secure authentication, and an intuitive user experience.

---

# ✨ Features

## 🔐 Authentication

- Secure User Registration
- Login with JWT Authentication
- Password Hashing (bcrypt)
- Protected Routes
- Persistent Sessions

---

## 📋 Task Management

- Create Tasks
- Update Tasks
- Delete Tasks
- Priority Levels
- Status Tracking
- Due Dates

---

## 📊 Dashboard

- Total Tasks
- Pending Tasks
- In Progress Tasks
- Completed Tasks
- Live Statistics

---

## 🔍 Search & Filters

- Search Tasks
- Filter by Status
- Filter by Priority

---

## 🎨 User Experience

- Responsive Design
- Modern UI
- Skeleton Loading
- Empty States
- Error Handling
- Toast Notifications

---

# 🛠 Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

## Backend

- Go (Golang)
- Fiber
- GORM
- JWT
- bcrypt

## Database

- PostgreSQL

## Tools

- Docker
- Git
- GitHub
- Postman
- Vercel

---

# 🏗 System Architecture

```text
                Next.js Frontend
                       │
                       │ REST API
                       ▼
                 Go Fiber Backend
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
     Middleware     Services     Repositories
                       │
                       ▼
                     GORM
                       │
                       ▼
                 PostgreSQL
```

---

# 📂 Project Structure

```text
TaskFlow
│
├── backend
│   ├── handlers
│   ├── middleware
│   ├── models
│   ├── repositories
│   ├── routes
│   ├── services
│   └── utils
│
├── frontend
│   ├── app
│   ├── components
│   ├── hooks
│   ├── services
│   ├── lib
│   └── types
│
└── README.md
```

---

# 🔐 Authentication Flow

```text
User Login
      │
      ▼
Email + Password
      │
      ▼
bcrypt Verification
      │
      ▼
JWT Generated
      │
      ▼
Stored on Client
      │
      ▼
Protected API Request
      │
      ▼
JWT Middleware
      │
      ▼
Authorized Response
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | `/api/auth/signup` |
| POST | `/api/auth/login` |
| GET | `/api/user/profile` |

## Tasks

| Method | Endpoint |
|---------|----------|
| GET | `/api/tasks` |
| POST | `/api/tasks` |
| PUT | `/api/tasks/:id` |
| DELETE | `/api/tasks/:id` |

## Search

| Method | Endpoint |
|---------|----------|
| GET | `/api/tasks/search?q=` |
| GET | `/api/tasks/filter?status=&priority=` |
| GET | `/api/tasks/stats` |

---

# 🚀 Quick Start

### Clone Repository

```bash
git clone https://github.com/your-username/taskflow.git
```

---

## Backend

```bash
cd backend

go mod tidy

go run cmd/main.go
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 📸 Screenshots

| Landing Page |
|--------------|
| *(Add Screenshot)* |

| Dashboard |
|-----------|
| *(Add Screenshot)* |

| Login |
|-------|
| *(Add Screenshot)* |

---
---

<div align="center">

### ⭐ If you like this project, don't forget to give it a star!

Made with ❤️ using Go, Fiber & Next.js

</div>
