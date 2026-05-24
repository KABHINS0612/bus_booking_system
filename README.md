# Bus Booking System

A full-stack web application for managing bus ticket bookings, built with Java Spring Boot (backend) and React + Vite (frontend).

## Overview

This project provides a complete solution for bus ticket booking and management, supporting both user and admin roles. Users can register, log in, book tickets, and view their trip history. Admins can manage trips, vehicles, drivers, and view all bookings.

### Architecture

- **Backend:** Java Spring Boot REST API, Spring Security for authentication, JPA for data persistence, Thymeleaf for server-side templates (admin panel).
- **Frontend:** React (with Vite) for a modern, responsive user interface.
- **Database:** H2 in-memory database for development (can be switched to MySQL or others).
- **Authentication:** Session-based login with BCrypt password hashing.

## Features

- User registration and login
- Admin and user roles with different access levels
- Book, view, and cancel bus tickets
- View trip details and booking history
- Admin dashboard for managing trips, vehicles, drivers, and users
- Secure authentication and session management
- Modern UI with React and Vite

# Bus Booking System

Full-stack Java Spring Boot bus booking management application.

## Quick Start

### Requirements
- Java 21+, Maven 3.8+, Node.js 16+

### Backend
```powershell
cd java-backend
mvn clean package
java -jar target/busbooking-backend-1.0.0.jar
```
Access: `http://localhost:3001`

### Frontend
```powershell
cd frontend
npm install
npm run dev
```
Access: `http://localhost:3000`

### Full Stack
```powershell
.\scripts\run-fullstack.ps1
```

## Project Structure

```

Busbooking system/
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── scripts/
│   └── src/
│       ├── api.js
│       ├── App.jsx
│       ├── main.jsx
│       ├── store.js
│       ├── styles.css
│       ├── components/
│       ├── contexts/
│       ├── pages/
│       ├── static/
│       │   ├── css/
│       │   │   ├── admin.css
│       │   │   └── style.css
│       │   └── js/
│       │       ├── admin.js
│       │       ├── portal.js
│       │       └── script.js
│       ├── templates/
│       │   ├── admin.html
│       │   ├── index.html
│       │   ├── trip_details.html
│       │   └── trip_history.html
│       └── utils/
│
├── java-backend/
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/
│           │   └── com/busbookingsystem/
│           │       ├── BusbookingSystemApplication.java
│           │       ├── config/
│           │       ├── controller/
│           │       │   ├── AdminController.java
│           │       │   ├── AuthController.java
│           │       │   ├── HomeController.java
│           │       │   ├── TripController.java
│           │       │   └── api/
│           │       │       ├── AdminApiController.java
│           │       │       ├── AuthApiController.java
│           │       │       ├── DataApiController.java
│           │       │       └── TripApiController.java
│           │       ├── dto/
│           │       ├── entity/
│           │       │   ├── Driver.java
│           │       │   ├── Role.java
│           │       │   ├── Trip.java
│           │       │   ├── User.java
│           │       │   └── Vehicle.java
│           │       ├── firebase/
│           │       ├── repository/
│           │       │   ├── DriverRepository.java
│           │       │   ├── TripRepository.java
│           │       │   ├── UserRepository.java
│           │       │   └── VehicleRepository.java
│           │       ├── security/
│           │       │   ├── CustomUserDetailsService.java
│           │       │   └── SecurityUtils.java
│           │       └── service/
│           │           ├── DriverService.java
│           │           ├── TripService.java
│           │           ├── UserService.java
│           │           └── VehicleService.java
│           └── resources/
│               ├── application.properties
│               ├── static/
│               │   ├── assets/
│               │   ├── css/
│               │   └── js/
│               └── templates/
│
├── scripts/
│   ├── rename_project.ps1
│   ├── run-backend.bat
│   ├── run-backend.ps1
│   ├── run-frontend.bat
│   ├── run-frontend.ps1
│   ├── run-fullstack.bat
│   └── run-fullstack.ps1
│
├── pom.xml
├── README.md
└── Note
