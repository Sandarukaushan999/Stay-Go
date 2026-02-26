# 🏠🚗 Stay & Go

### Smart Hostel Sharing & Ride Sharing Platform for University Students

Stay & Go is a full-stack smart hostel and ride sharing system designed specifically for university students. The platform integrates intelligent roommate matching, real-time ride sharing, hostel maintenance management, and secure user administration into one unified system.

It enhances student convenience, safety, and efficiency while simplifying hostel and ride management processes.

---

## 📌 Project Overview

Stay & Go provides:

* 🛏 Smart roommate matching based on compatibility scoring
* 🚘 Ride sharing with live GPS tracking and fare calculation
* 🔧 Hostel maintenance request and technician management
* 🔐 Secure user authentication and role-based access control

The system supports multiple user roles and ensures secure, scalable operations.

---

## 👥 User Roles

* **Student** – Create profiles, find roommates, request rides, submit maintenance tickets
* **Driver** – Offer rides, manage ride requests, track earnings
* **Hostel Staff / Technician** – Manage and update maintenance tickets
* **Admin** – Full system control, user management, complaints, and announcements

---

## 🧠 Core Modules

### 1️⃣ Roommate Matching System

* Profile creation & preference management
* Compatibility score algorithm
* Match recommendations
* Chat after matching
* Block & report users

---

### 2️⃣ Ride Sharing & Tracking System

* Create ride offers
* Request rides
* Live GPS tracking (OpenStreetMap integration)
* Fare calculation per kilometer
* Ratings & reviews
* Payment tracking

---

### 3️⃣ Hostel Maintenance Management

* Create and track maintenance tickets
* Priority level assignment
* Technician allocation
* Image upload for issues
* Progress timeline tracking

---

### 4️⃣ User & Admin Management

* Role-Based Access Control (RBAC)
* Secure authentication (JWT / Session-based)
* User verification
* Complaint handling system
* Announcement management

---

## 🗄 Database Design (Main Collections / Tables)

* Users
* Profiles
* RoommatePreferences
* Matches
* RideOffers
* RideRequests
* Payments
* MaintenanceTickets
* Technicians
* Complaints

---

## 🏗 System Architecture

### Frontend

* React.js

### Backend

* Node.js (Express)

### Database

* MongoDB

### APIs & Services

* OpenStreetMap (Maps & Location)
* JWT Authentication

### Architecture Flow

```
User → Frontend → Backend API → Database
```

---

## 📁 Project Structure

```
Stay-Go/
├── frontend/               # React.js frontend application
│   ├── public/
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Page-level components
│       ├── services/       # API service calls
│       └── utils/          # Utility functions
├── backend/                # Node.js/Express backend API
│   ├── config/             # Database and app configuration
│   ├── controllers/        # Route handler logic
│   ├── models/             # Database models/schemas
│   ├── routes/             # API route definitions
│   ├── middleware/         # Auth and validation middleware
│   └── utils/              # Helper utilities
└── database/               # Database schema and seed data
    ├── schema/
    └── seeds/
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js >= 18.x
* MongoDB >= 6.x
* npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Sandarukaushan999/Stay-Go.git
cd Stay-Go
```

2. **Install backend dependencies**

```bash
cd backend
npm install
```

3. **Install frontend dependencies**

```bash
cd ../frontend
npm install
```

4. **Configure environment variables**

```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB URI and JWT secret
```

5. **Start the development servers**

```bash
# Backend (from /backend)
npm run dev

# Frontend (from /frontend)
npm start
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| POST | `/api/auth/logout` | Logout user |

### Users / Profiles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me` | Get current user profile |
| PUT | `/api/users/me` | Update current user profile |
| GET | `/api/users/:id` | Get user by ID |

### Roommate Matching
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/roommates/matches` | Get roommate matches |
| POST | `/api/roommates/preferences` | Set roommate preferences |
| POST | `/api/roommates/request/:id` | Send match request |

### Rides
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rides` | List available rides |
| POST | `/api/rides` | Create a ride offer |
| POST | `/api/rides/:id/request` | Request to join a ride |
| PUT | `/api/rides/:id/status` | Update ride status |

### Maintenance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/maintenance` | List maintenance tickets |
| POST | `/api/maintenance` | Submit a maintenance request |
| PUT | `/api/maintenance/:id` | Update ticket status |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List all users |
| PUT | `/api/admin/users/:id` | Update user role/status |
| GET | `/api/admin/complaints` | List all complaints |
| POST | `/api/admin/announcements` | Create announcement |

---

## ✨ Key Features

* Smart compatibility-based roommate matching
* Real-time ride tracking
* Secure role-based authentication
* Maintenance ticket progress tracking
* Integrated payment monitoring
* Scalable modular architecture

---

## 🎯 Project Goals

* Improve hostel living experience
* Promote safe and cost-efficient ride sharing
* Digitize hostel maintenance processes
* Ensure secure and structured user management

---

## 🚀 Future Improvements

* Mobile App Version (React Native / Flutter)
* AI-based roommate prediction enhancement
* In-app wallet integration
* Push notifications
* Analytics dashboard for admin

---

## 📜 License

This project is developed for academic and educational purposes.