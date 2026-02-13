# Setup Guide for Nafisa Aldoo School Management System

## Introduction
This setup guide provides step-by-step instructions for deploying the Nafisa Aldoo School Management System in a production environment. It covers the prerequisites, installation steps, and post-installation configurations necessary to ensure the system operates smoothly.

## Prerequisites
Before proceeding with the installation, ensure that the following prerequisites are met:

1. **Server Requirements**
   - A web server (e.g., Apache, Nginx)
   - PHP version 7.4 or higher
   - MySQL version 5.7 or higher
   - Composer for managing PHP dependencies

2. **Software Dependencies**
   - Node.js and npm (for front-end dependencies)
   - Any additional libraries or extensions required by the application (as specified in the `composer.json` and `package.json` files)

3. **Access Requirements**
   - SSH access to the server for deployment
   - Database access credentials

## Installation Steps

### Step 1: Clone the Repository
Clone the Nafisa Aldoo School Management System repository to your server using the following command:
```bash
git clone https://github.com/laila2005/Nafisa-Aldoo-school-system.git
```

### Step 2: Navigate to the Project Directory
Change to the project directory:
```bash
cd Nafisa-Aldoo-school-system
```

### Step 3: Install PHP Dependencies
Run Composer to install the required PHP dependencies:
```bash
composer install
```

### Step 4: Install Front-end Dependencies
If the project includes front-end assets, install them using npm:
```bash
npm install
```

### Step 5: Configure Environment Variables
Copy the example environment file and configure it with your settings:
```bash
cp .env.example .env
```
Edit the `.env` file to set your database connection details and other environment-specific settings.

### Step 6: Generate Application Key
Generate the application key for secure sessions and encrypted data:
```bash
php artisan key:generate
```

### Step 7: Run Database Migrations
Run the database migrations to set up the database schema:
```bash
php artisan migrate
```

### Step 8: Seed the Database
(Optional) Seed the database with initial data:
```bash
php artisan db:seed
```

### Step 9: Set Up Web Server
Configure your web server to serve the application. Ensure that the document root points to the `public` directory of the project.

### Step 10: Start the Server
Start your web server and ensure that it is running correctly. You can access the application via your web browser.

## Post-Installation Configuration
After installation, you may need to perform additional configurations:

- Set up SSL for secure connections.
- Configure caching and session storage as per your requirements.
- Review and adjust user roles and permissions in the application.

## Conclusion
Following this setup guide will help you successfully deploy the Nafisa Aldoo School Management System. For further assistance, refer to the documentation or seek help from the community.