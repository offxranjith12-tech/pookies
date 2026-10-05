# Pookie's - Premium Beauty & Cosmetics (Belleaura)

Welcome to **Pookie's Belleaura**, a full-stack web application designed for a premium beauty, cosmetics, and salon services platform. This application allows users to browse beauty products, book appointments with beauty artists, manage their orders, and leave reviews.

## 🚀 Features

*   **User Authentication**: Secure user registration and login with JWT.
*   **Product Management**: Browse, search, and manage a catalog of premium beauty products and cosmetics.
*   **Artist Bookings**: Discover beauty professionals/artists and book appointments for salon services.
*   **Shopping Cart & Orders**: Add products to your cart and securely place orders.
*   **Reviews**: Leave and read reviews for products and artists.
*   **Admin Dashboard** *(if applicable)*: Manage users, products, orders, and artists.

## 🛠️ Technology Stack

### Client-side (Frontend)
*   **React 19**
*   **Vite** (Build Tool)
*   **React Router** (Navigation)
*   **React Bootstrap / Bootstrap 5** (Styling & UI Components)
*   **Axios** (HTTP Client)
*   **jsPDF** (PDF generation for receipts/reports)

### Server-side (Backend)
*   **Node.js** & **Express** (Web Framework)
*   **Sequelize** (ORM for Database)
*   **MySQL2** (Database Driver)
*   **JSON Web Token (JWT)** (Authentication)
*   **Bcryptjs** (Password Hashing)
*   **Multer** (File Uploads)

## 📁 Project Structure

The repository is structured as a monorepo with separate `client` and `server` directories:

```
belleaura/
├── client/                 # React frontend application
│   ├── public/             # Static assets
│   ├── src/                # React source code (components, pages, styles)
│   ├── package.json        # Frontend dependencies and scripts
│   └── vite.config.js      # Vite configuration
│
├── server/                 # Node.js + Express backend application
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middlewares (auth, error handling)
│   ├── models/             # Sequelize database models
│   ├── routes/             # API routes definition
│   ├── uploads/            # Uploaded images/files
│   ├── package.json        # Backend dependencies and scripts
│   └── server.js           # Express app entry point
```

## ⚙️ Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
*   [Node.js](https://nodejs.org/) (v16+ recommended)
*   [MySQL](https://www.mysql.com/) database server installed and running

### 1. Database Setup
1. Create a MySQL database for the application.
2. Navigate to the `server/` directory and configure the environment variables:
   *   Copy or create a `.env` file in the `server` directory.
   *   Add your database credentials:
       ```env
       PORT=5000
       DB_HOST=localhost
       DB_USER=your_mysql_user
       DB_PASSWORD=your_mysql_password
       DB_NAME=your_database_name
       JWT_SECRET=your_jwt_secret
       ```

### 2. Backend Setup (Server)
Open a terminal and navigate to the `server` directory:

```bash
cd server
npm install
```

To seed the database with initial data (products, artists, etc.):
```bash
node sync-db.js
node seed.js
```

Start the backend server:
```bash
npm start
# or use node server.js
```
The API will run on `http://localhost:5000`.

### 3. Frontend Setup (Client)
Open a new terminal window and navigate to the `client` directory:

```bash
cd client
npm install
```

Start the React development server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173`.

## 📡 API Endpoints Overview

The backend provides a RESTful API. Here are the main resource routes:

*   **Auth:** `/api/auth` (Login, Register)
*   **Users:** `/api/users` (Profile management)
*   **Products:** `/api/products` (Product catalog)
*   **Artists:** `/api/artists` (Beauty professionals)
*   **Bookings:** `/api/bookings` (Appointment scheduling)
*   **Orders:** `/api/orders` (E-commerce orders)
*   **Reviews:** `/api/reviews` (Product/Artist ratings)

## 📄 License
ISC
