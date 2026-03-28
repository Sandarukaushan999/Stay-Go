# Stay-Go Backend Auth API

## Endpoints

### POST /api/register
- Register a new user
- Body: `{ "username": "string", "password": "string", "role": "student|technitian|rider|admin" }`
- Returns: 201 on success, 409 if username exists

### POST /api/login
- Login with username and password
- Body: `{ "username": "string", "password": "string" }`
- Returns: `{ token, role }` on success

### GET /api/admin
- Protected route, admin only
- Header: `Authorization: Bearer <token>`

## Roles
- student
- technitian
- rider
- admin

## RBAC
- Use JWT in Authorization header
- Use `/api/admin` as example for role-based access

---

## Setup
1. Install dependencies:
   ```
   npm install express mongoose cors bcryptjs jsonwebtoken
   ```
2. Start MongoDB locally on default port (27017)
3. Run server:
   ```
   node server.js
   ```
