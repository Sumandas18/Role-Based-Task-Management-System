# Postman Testing Guide - Role-Based Task Management System

Base URL: `http://localhost:4000/api/v1`

## 1. Authentication

### Register User
- **URL**: `POST /auth/register`
- **Body** (JSON):
  ```json
  {
    "name": "Super Admin",
    "email": "superadmin@example.com",
    "password": "password123",
    "role": "SuperAdmin"
  }
  ```

### Login
- **URL**: `POST /auth/login`
- **Body** (JSON):
  ```json
  {
    "email": "superadmin@example.com",
    "password": "password123"
  }
  ```
- **Response**: Copy the `accessToken` and use it as a Bearer Token for other requests.

### Refresh Token
- **URL**: `POST /auth/refresh`
- **Body** (JSON):
  ```json
  {
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }
  ```

### Logout
- **URL**: `POST /auth/logout`
- **Headers**: `Authorization: Bearer <accessToken>`

---

## 2. User Management (SuperAdmin/Admin Only)

### Get All Users
- **URL**: `GET /users`
- **Headers**: `Authorization: Bearer <accessToken>`

### Update User Role (SuperAdmin Only)
- **URL**: `PATCH /users/:id/role`
- **Body**: `{"role": "Admin"}`

### Update User Status
- **URL**: `PATCH /users/:id/status`
- **Body**: `{"status": "Inactive"}`

---

## 3. Task Management

### Create Task (Manager/Admin/SuperAdmin)
- **URL**: `POST /tasks`
- **Body**:
  ```json
  {
    "title": "Complete Documentation",
    "description": "Finish the system docs",
    "priority": "High",
    "assignedTo": "USER_ID_HERE",
    "dueDate": "2024-12-31"
  }
  ```

### Get All Tasks
- **URL**: `GET /tasks`
- **Note**: Employees see only their assigned tasks. Managers see tasks they assigned or are assigned to them.

### Update Task
- **URL**: `PATCH /tasks/:id`
- **Note**: Employees can ONLY update `status`.

### Delete Task (Manager/Admin/SuperAdmin)
- **URL**: `DELETE /tasks/:id`
