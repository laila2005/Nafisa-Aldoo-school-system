# Nafisa Aldoo School System - Backend

A Node.js/Express/TypeScript backend for the school management system.

## Tech Stack

- **Node.js** with **Express** - Web framework
- **TypeScript** - Type-safe JavaScript
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files (database, etc.)
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Express middleware (auth, etc.)
│   ├── models/         # Sequelize models
│   ├── routes/         # API routes
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   └── index.ts        # Main server file
├── .env                # Environment variables
├── .env.example        # Example environment variables
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── nodemon.json        # Nodemon configuration
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup PostgreSQL Database

Make sure PostgreSQL is installed and running. Create a database:

```sql
CREATE DATABASE nafisa_aldoo_school;
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Update the database credentials in `.env`:
- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 5432)
- `DB_NAME` - Database name
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - Secret key for JWT (change in production!)

### 4. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
```

**Run production build:**
```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student"
  }
  ```

- `POST /api/auth/login` - Login
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### Health Check

- `GET /health` - Check if server is running

## Database Models

- **User** - Base user model (email, password, role, etc.)
- **Student** - Student-specific information
- **Teacher** - Teacher-specific information
- **Class** - Class/course information

## User Roles

- `admin` - Full system access
- `teacher` - Teacher access
- `student` - Student access
- `parent` - Parent/guardian access

## Development

The server will automatically restart when you make changes to the code (thanks to nodemon).

Database tables will be automatically created when you start the server for the first time.

## Notes

- Make sure PostgreSQL is running before starting the server
- The database will be synced automatically on server start
- Change the `JWT_SECRET` in production!
- Never commit the `.env` file to version control
