# Backend Localization Setup Complete! 🌍

## What Was Implemented

### 1. Translation Files Created

- ✅ `backend/src/locales/en.json` - English translations
- ✅ `backend/src/locales/ar.json` - Arabic translations

### 2. i18n Utility Created

- ✅ `backend/src/utils/i18n.ts` - Translation helper functions

### 3. Middleware Created

- ✅ `backend/src/middleware/localization.middleware.ts` - Auto-detects user language

### 4. Controllers Updated

- ✅ `authController.ts` - Now uses translations for all messages

### 5. Server Configuration

- ✅ `index.ts` - Localization middleware integrated
- ✅ `tsconfig.json` - JSON module resolution enabled

## How It Works

### Language Detection Priority

1. **Query Parameter**: `?lang=ar` or `?lang=en`
2. **Accept-Language Header**: Checks browser/client preferences
3. **Default**: Falls back to English

### Response Headers

Every response includes: `Content-Language: en` or `Content-Language: ar`

## Testing the API

### English (Default)

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "student@school.com",
  "password": "Password123",
  "firstName": "Ahmed",
  "lastName": "Ali",
  "role": "STUDENT"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": { ... }
}
```

### Arabic (via Query Parameter)

```bash
POST http://localhost:5000/api/auth/register?lang=ar
Content-Type: application/json

{
  "email": "teacher@school.com",
  "password": "Password123",
  "firstName": "Fatima",
  "lastName": "Hassan",
  "role": "TEACHER"
}
```

**Response:**

```json
{
  "success": true,
  "message": "تم تسجيل المستخدم بنجاح",
  "data": { ... }
}
```

### Arabic (via Header)

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json
Accept-Language: ar

{
  "email": "teacher@school.com",
  "password": "Password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "data": { ... }
}
```

## Available Translation Keys

### Auth

- `auth.loginSuccess`
- `auth.registerSuccess`
- `auth.invalidCredentials`
- `auth.emailExists`
- `auth.userNotFound`
- `auth.accountInactive`

### Courses

- `courses.courseCreated`
- `courses.courseUpdated`
- `courses.courseDeleted`
- `courses.courseNotFound`
- `courses.studentEnrolled`
- `courses.alreadyEnrolled`

### Attendance

- `attendance.attendanceMarked`
- `attendance.attendanceUpdated`
- `attendance.attendanceNotFound`

### Grades

- `grades.gradeEntered`
- `grades.gradeUpdated`
- `grades.gradeDeleted`
- `grades.gradeNotFound`

### Errors

- `errors.required`
- `errors.invalidEmail`
- `errors.passwordTooShort`
- `errors.unauthorized`
- `errors.forbidden`
- `errors.notFound`
- `errors.serverError`
- `errors.validationError`

## Using Translations in New Controllers

```typescript
import type { Request, Response } from 'express';
import { t } from '../utils/i18n';

export const createCourse = async (req: Request, res: Response) => {
  try {
    // Your logic here

    res.status(201).json({
      success: true,
      message: t('courses.courseCreated', req.language),
      data: course,
    });
  } catch (error: any) {
    res.status(500).json({
      error: t('errors.serverError', req.language),
    });
  }
};
```

## Server Status

🟢 **Server Running**: http://localhost:5000
🟢 **API Endpoint**: http://localhost:5000/api
🟢 **Localization**: Enabled (EN/AR)

## Next Steps

To add more languages:

1. Create new JSON file (e.g., `fr.json` for French)
2. Add translations to `backend/src/locales/`
3. Update `Language` type in `i18n.ts`
4. Update `translations` object in `i18n.ts`
5. Update language detection in `getUserLanguage()`

All future controllers can use the same pattern!
