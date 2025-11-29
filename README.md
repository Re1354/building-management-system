# Building Management System

A full-stack web application for managing building tenants and rent collections.

## Features

✅ **Authentication**

- User registration and login
- JWT-based authentication
- Protected routes

✅ **Tenant Management**

- Add, edit, and delete tenants
- Track tenant information (floor, flat, name, phone)
- View all tenants in a table

✅ **Collection Management**

- Record rent collections
- Track payment history
- View collection summaries
- Monthly and yearly reports

✅ **Dashboard**

- Total collection overview
- Collection statistics by admin
- Monthly collection charts
- Quick action buttons

## Tech Stack

### Frontend

- **React 19** - UI library
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Tailwind CSS** - Styling

### Backend

- **Node.js & Express** - Server
- **MongoDB & Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Start the server:

```bash
npm start
```

Server runs on `http://localhost:3000`

### Frontend Setup

1. Navigate to client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

Frontend runs on `http://localhost:5174` (or another port if 5173/5174 are in
use)

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Tenants

- `POST /api/tenants` - Create tenant
- `GET /api/tenants` - Get all tenants
- `PUT /api/tenants/:id` - Update tenant
- `DELETE /api/tenants/:id` - Delete tenant

### Collections

- `POST /api/collections` - Add collection
- `GET /api/collections` - Get all collections
- `GET /api/collections/my` - Get user's collections
- `GET /api/collections/summary/my/monthly` - Monthly summary
- `GET /api/collections/summary/my/yearly` - Yearly summary
- `GET /api/collections/summary/building` - Building summary
- `GET /api/collections/chart` - Chart data

## Project Structure

```
building-management/
├── client/                 # Frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   └── Layout.jsx
│   │   ├── context/       # Context providers
│   │   │   └── authContext.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Tenants.jsx
│   │   │   ├── Collections.jsx
│   │   │   └── AddCollection.jsx
│   │   ├── utils/         # Utilities
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── server/                # Backend
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── authController.js
    │   ├── tenantController.js
    │   └── collectionController.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── models/
    │   ├── User.js
    │   ├── Tenant.js
    │   └── Collection.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── tenantRoutes.js
    │   └── collectionRoutes.js
    ├── index.js
    └── package.json
```

## Usage

1. **Register an Account**: Create a new admin account
2. **Login**: Sign in with your credentials
3. **Add Tenants**: Navigate to Tenants page and add tenant information
4. **Record Collections**: Go to Collections and add rent payments
5. **View Dashboard**: Check statistics and charts on the dashboard

## Screenshots

###Login
<img width="1600" height="722" alt="image" src="https://github.com/user-attachments/assets/dfde1d66-e857-4951-9eb6-6ff2f7ce506f" />

### Dashboard

- Overview cards showing total collections
- Monthly collection chart
- Quick action buttons
<img width="1600" height="762" alt="image" src="https://github.com/user-attachments/assets/186aee87-afb7-4d9a-8437-e06efa0b70e9" />


### Tenants Management

- Table view of all tenants
- Add/Edit/Delete functionality
- Search and filter options
<img width="1600" height="733" alt="image" src="https://github.com/user-attachments/assets/ccf5d394-abd4-45b3-9e31-2b19af6b7c4e" />
<img width="1600" height="729" alt="image" src="https://github.com/user-attachments/assets/9cd98891-3797-4008-b081-928053fed24c" />


### Collections

- Complete payment history
- Detailed transaction information
- Add new collection form
<img width="1600" height="726" alt="image" src="https://github.com/user-attachments/assets/8a3a9bb9-12e5-4399-a332-0962d858c62f" />
<img width="1600" height="724" alt="image" src="https://github.com/user-attachments/assets/da55cff4-ebff-469f-adcb-5f6d22756f57" />


## Security

- Passwords are hashed using bcryptjs
- JWT tokens for authentication
- Protected API routes with middleware
- CORS enabled for frontend requests
