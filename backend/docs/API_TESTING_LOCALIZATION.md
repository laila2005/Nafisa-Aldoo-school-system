# API Testing Examples - Localization

## Test 1: Register User (English - Default)

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "student1@school.com",
  "password": "Password123",
  "firstName": "John",
  "lastName": "Smith",
  "role": "STUDENT",
  "phone": "+1234567890"
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "uuid-here",
    "email": "student1@school.com",
    "firstName": "John",
    "lastName": "Smith",
    "role": "STUDENT"
  }
}
```

---

## Test 2: Register User (Arabic - Query Parameter)

```http
POST http://localhost:5000/api/auth/register?lang=ar
Content-Type: application/json

{
  "email": "student2@school.com",
  "password": "Password123",
  "firstName": "أحمد",
  "lastName": "علي",
  "role": "STUDENT",
  "phone": "+966501234567"
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "تم تسجيل المستخدم بنجاح",
  "data": {
    "id": "uuid-here",
    "email": "student2@school.com",
    "firstName": "أحمد",
    "lastName": "علي",
    "role": "STUDENT"
  }
}
```

---

## Test 3: Login (English)

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "student1@school.com",
  "password": "Password123"
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "uuid-here",
      "email": "student1@school.com",
      "firstName": "John",
      "lastName": "Smith",
      "role": "STUDENT"
    }
  }
}
```

---

## Test 4: Login (Arabic - Header)

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json
Accept-Language: ar

{
  "email": "student2@school.com",
  "password": "Password123"
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "uuid-here",
      "email": "student2@school.com",
      "firstName": "أحمد",
      "lastName": "علي",
      "role": "STUDENT"
    }
  }
}
```

---

## Test 5: Error - Missing Required Fields (English)

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "test@school.com"
}
```

**Expected Response:**

```json
{
  "error": "This field is required"
}
```

---

## Test 6: Error - Missing Required Fields (Arabic)

```http
POST http://localhost:5000/api/auth/register?lang=ar
Content-Type: application/json

{
  "email": "test@school.com"
}
```

**Expected Response:**

```json
{
  "error": "هذا الحقل مطلوب"
}
```

---

## Test 7: Error - User Already Exists (English)

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "student1@school.com",
  "password": "Password123",
  "firstName": "Jane",
  "lastName": "Doe",
  "role": "STUDENT"
}
```

**Expected Response:**

```json
{
  "error": "User with this email already exists"
}
```

---

## Test 8: Error - Invalid Credentials (Arabic)

```http
POST http://localhost:5000/api/auth/login?lang=ar
Content-Type: application/json

{
  "email": "wrong@school.com",
  "password": "WrongPassword"
}
```

**Expected Response:**

```json
{
  "error": "بريد إلكتروني أو كلمة مرور غير صحيحة"
}
```

---

## How to Test in Thunder Client

1. Open Thunder Client extension in VS Code
2. Create a new request
3. Set method to `POST`
4. Enter URL: `http://localhost:5000/api/auth/register`
5. Go to **Headers** tab and add:
   - `Content-Type: application/json`
   - Optional: `Accept-Language: ar` (for Arabic)
6. Go to **Body** tab, select **JSON** and paste the JSON from examples above
7. Click **Send**

## Switching Languages

### Method 1: Query Parameter

Add `?lang=ar` or `?lang=en` to any URL:

```
http://localhost:5000/api/auth/register?lang=ar
```

### Method 2: Accept-Language Header

Add header to your request:

```
Accept-Language: ar
```

### Method 3: Default

If neither is specified, defaults to English.

---

## Check Response Language

Look for the `Content-Language` header in the response:

- `Content-Language: en` = English
- `Content-Language: ar` = Arabic
