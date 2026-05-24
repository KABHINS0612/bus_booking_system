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


## Authentication

Session-based login with Spring Security (BCrypt passwords).

| Role | How to sign in |
|------|----------------|
| **Register** | User tab → Register → username, contact, password (min 6 chars) |
| **User login** | Username + password |
| **Admin login** | `admin` / `admin123` |

Start **both** backend (port 3001) and frontend (port 3000). The React app talks to the API via Vite proxy at `/api`.

## Configuration
Backend config: `java-backend/src/main/resources/application.properties`
- `server.port=3001`
- `spring.datasource.url=jdbc:h2:mem:testdb`
