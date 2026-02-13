# Configuration Settings for Deployment

This document outlines the configuration settings required for deploying the Nafisa Aldoo School Management System. Proper configuration is essential to ensure the system operates smoothly in a production environment.

## Environment Variables

The following environment variables should be set in your deployment environment:

- **DATABASE_URL**: The connection string for the database. This should include the database type, username, password, host, and database name.
  
- **PORT**: The port on which the application will run. Default is `3000`.

- **NODE_ENV**: Set this to `production` to enable production-specific optimizations.

- **JWT_SECRET**: A secret key used for signing JSON Web Tokens for user authentication.

- **EMAIL_SERVICE**: The email service provider to be used for sending emails (e.g., Gmail, SendGrid).

- **EMAIL_USER**: The username/email address for the email service.

- **EMAIL_PASS**: The password for the email service account.

## Configuration Files

### 1. `config.json`

This file contains application-specific configurations. Ensure it includes the following sections:

```json
{
  "database": {
    "host": "localhost",
    "port": 5432,
    "username": "your_username",
    "password": "your_password",
    "database": "nafisa_school_db"
  },
  "server": {
    "port": 3000
  },
  "jwt": {
    "secret": "your_jwt_secret"
  }
}
```

### 2. `app.js`

In your main application file, ensure that you load the environment variables and configuration settings correctly:

```javascript
require('dotenv').config();
const config = require('./config.json');

// Use config settings
const dbConfig = config.database;
const serverPort = process.env.PORT || config.server.port;
```

## Deployment Steps

1. **Set Up Environment**: Ensure all environment variables are set as described above.

2. **Install Dependencies**: Run `npm install` to install all required packages.

3. **Run Migrations**: If using a migration tool, run the necessary commands to set up the database schema.

4. **Start the Application**: Use `npm start` to launch the application in production mode.

5. **Monitor Logs**: Ensure to monitor application logs for any errors or warnings during startup and operation.

## Conclusion

Proper configuration is crucial for the successful deployment of the Nafisa Aldoo School Management System. Ensure all settings are correctly applied to avoid issues in the production environment.