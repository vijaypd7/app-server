# Express Server with MySQL

A simple Express.js server with MySQL database integration.

## Features

- Basic Express server setup
- MySQL database integration with connection pooling
- JSON and URL-encoded body parsing
- Health check endpoint with database status
- Complete CRUD API for users
- Error handling middleware
- 404 handler
- Environment variable configuration

## Prerequisites

- Node.js (v14 or higher)
- MySQL server running locally or remotely

## Getting Started

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up MySQL database:**
   - Create a MySQL database for your application
   - Note your database credentials

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=your_database_name
   PORT=3000
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

5. The server will start on http://localhost:3000 and automatically:
   - Test the database connection
   - Create the `users` table if it doesn't exist

## Available Routes

### General Routes
- `GET /` - Welcome message
- `GET /health` - Health check endpoint (includes database status)

### User API Routes
- `GET /api/users` - Get all users from database
- `GET /api/users/:id` - Get a specific user by ID
- `POST /api/users` - Create a new user (requires name and email in body)
- `PUT /api/users/:id` - Update an existing user (requires name and email in body)
- `DELETE /api/users/:id` - Delete a user by ID

## Testing the API

You can test the API using curl:

```bash
# Get welcome message
curl http://localhost:3000/

# Health check (includes database status)
curl http://localhost:3000/health

# Get all users
curl http://localhost:3000/api/users

# Get a specific user
curl http://localhost:3000/api/users/1

# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'

# Update a user
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "John Smith", "email": "johnsmith@example.com"}'

# Delete a user
curl -X DELETE http://localhost:3000/api/users/1
```

## Database Schema

The application automatically creates a `users` table with the following structure:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `DB_HOST` - MySQL host (default: localhost)
- `DB_PORT` - MySQL port (default: 3306)
- `DB_USER` - MySQL username (default: root)
- `DB_PASSWORD` - MySQL password (default: empty)
- `DB_NAME` - MySQL database name (default: test_db)

## Error Handling

The API returns consistent JSON responses:

**Success Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error description",
  "message": "Detailed error message"
}
```
