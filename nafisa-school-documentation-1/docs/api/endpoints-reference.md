# API Endpoints Reference

This document serves as a reference for the API endpoints available in the Nafisa Aldoo School Management System. Each endpoint is described with its functionality, required parameters, and expected responses.

## Base URL
The base URL for all API requests is:
```
http://<your-domain>/api
```

## Authentication
All endpoints require authentication. Use the following method to obtain a token:
- **POST** `/auth/login`
  - **Request Body**: 
    ```json
    {
      "email": "user@example.com",
      "password": "yourpassword"
    }
    ```
  - **Response**:
    ```json
    {
      "token": "your_jwt_token"
    }
    ```

## Endpoints

### Users

- **GET** `/users`
  - **Description**: Retrieve a list of all users.
  - **Response**:
    ```json
    [
      {
        "id": 101,
        "first_name": "زينب",
        "last_name": "المحبوب عبد الصادق",
        "email": "zainab.mahmoud@nafisa-school.edu.sd",
        "role": "TEACHER"
      },
      ...
    ]
    ```

- **POST** `/users`
  - **Description**: Create a new user.
  - **Request Body**:
    ```json
    {
      "first_name": "اسم",
      "last_name": "اسم العائلة",
      "email": "email@example.com",
      "password": "yourpassword",
      "role": "STUDENT/TEACHER/ADMIN"
    }
    ```
  - **Response**:
    ```json
    {
      "id": 301,
      "message": "User created successfully."
    }
    ```

### Students

- **GET** `/students`
  - **Description**: Retrieve a list of all students.
  - **Response**:
    ```json
    [
      {
        "id": 301,
        "first_name": "إسراء",
        "last_name": "الريح خلف الله",
        "email": "israa.alsadiq@student.nafisa-school.edu.sd"
      },
      ...
    ]
    ```

- **GET** `/students/{id}`
  - **Description**: Retrieve details of a specific student.
  - **Response**:
    ```json
    {
      "id": 301,
      "first_name": "إسراء",
      "last_name": "الريح خلف الله",
      "date_of_birth": "2012-01-15",
      "status": "ACTIVE"
    }
    ```

### Classes

- **GET** `/classes`
  - **Description**: Retrieve a list of all class sections.
  - **Response**:
    ```json
    [
      {
        "id": "c1111111-1111-1111-1111-111111111111",
        "name": "الصف الأول",
        "grade_level": "GRADE_1"
      },
      ...
    ]
    ```

- **POST** `/classes`
  - **Description**: Create a new class section.
  - **Request Body**:
    ```json
    {
      "name": "الصف الجديد",
      "grade_level": "GRADE_X",
      "max_students": 30
    }
    ```
  - **Response**:
    ```json
    {
      "id": "new_class_id",
      "message": "Class section created successfully."
    }
    ```

### Enrollments

- **POST** `/enrollments`
  - **Description**: Enroll a student in a class section.
  - **Request Body**:
    ```json
    {
      "student_id": 301,
      "class_section_id": "c1111111-1111-1111-1111-111111111111",
      "academic_year_id": "b1111111-1111-1111-1111-111111111111"
    }
    ```
  - **Response**:
    ```json
    {
      "message": "Student enrolled successfully."
    }
    ```

## Error Handling
All API responses will include a status code and a message. Common status codes include:
- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **404**: Not Found
- **500**: Internal Server Error

## Conclusion
This document provides a comprehensive overview of the API endpoints available in the Nafisa Aldoo School Management System. For further details on authentication and specific endpoint usage, refer to the respective sections in the documentation.