 DarshanEase — Temple Darshan Ticket Booking App

A full-stack **MERN** web application for seamless temple darshan ticket booking.

---
🎥 Project Demo Video
Watch Demo Video: https://drive.google.com/file/d/1RYSHJO4OTMemd4TrS4OZthPBOFYXM_Rx/view?usp=drive_link

## 🏗️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React.js (Vite), Bootstrap 5        |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB, Mongoose                   |
| Auth       | JWT (JSON Web Tokens), bcrypt.js    |
| HTTP       | Axios                               |
| Routing    | React Router DOM v6                 |
| Toasts     | React Toastify                      |

---

## 📁 Project Structure

```
DarshanEase/
├── client/                   # React Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   └── common/       # Navbar, Footer, PrivateRoute
│   │   ├── context/          # AuthContext (Global State)
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Temples.jsx
│   │   │   ├── TempleDetail.jsx
│   │   │   ├── user/         # MyBookings
│   │   │   ├── organizer/    # OrganizerDashboard
│   │   │   └── admin/        # AdminDashboard
│   │   └── utils/            # Axios API config
│   └── index.html
│
└── server/                   # Express Backend
    ├── config/               # MongoDB connection
    ├── controllers/          # Business logic
    ├── middleware/           # JWT auth + role middleware
    ├── models/               # Mongoose schemas
    ├── routes/               # API routes
    └── index.js              # Entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)
- npm

---

### 1. Clone / Setup

```bash
# Navigate to project
cd DarshanEase
```

---

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file (already provided):
```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/darshanease
JWT_SECRET=darshanease_jwt_secret_key_2024
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Start the server:
```bash
npm run dev
# OR
nodemon index.js
```

Server runs at: **http://localhost:8000**

---

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

App runs at: **http://localhost:5173**

---

## 🔐 Roles & Access

| Role       | Access                                              |
|------------|-----------------------------------------------------|
| USER       | Browse temples, book darshan, view/cancel bookings  |
| ORGANIZER  | Manage own temples, create/update darshan slots     |
| ADMIN      | Full access — manage users, organizers, all data    |

> **Create an ADMIN:** Register normally, then manually update the role in MongoDB:
> ```
> db.users.updateOne({ email: "admin@mail.com" }, { $set: { role: "ADMIN" } })
> ```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint             | Access  |
|--------|----------------------|---------|
| POST   | /api/auth/register   | Public  |
| POST   | /api/auth/login      | Public  |
| GET    | /api/auth/profile    | Private |
| PUT    | /api/auth/profile    | Private |

### Temples
| Method | Endpoint                  | Access           |
|--------|---------------------------|------------------|
| GET    | /api/temples              | Public           |
| GET    | /api/temples/:id          | Public           |
| GET    | /api/temples/my-temples   | ORGANIZER/ADMIN  |
| POST   | /api/temples              | ORGANIZER/ADMIN  |
| PUT    | /api/temples/:id          | ORGANIZER/ADMIN  |
| DELETE | /api/temples/:id          | ADMIN            |

### Darshan Slots
| Method | Endpoint                      | Access           |
|--------|-------------------------------|------------------|
| GET    | /api/slots/temple/:templeId   | Public           |
| GET    | /api/slots/my-slots           | ORGANIZER/ADMIN  |
| GET    | /api/slots                    | ADMIN            |
| POST   | /api/slots                    | ORGANIZER/ADMIN  |
| PUT    | /api/slots/:id                | ORGANIZER/ADMIN  |
| DELETE | /api/slots/:id                | ORGANIZER/ADMIN  |

### Bookings
| Method | Endpoint                      | Access    |
|--------|-------------------------------|-----------|
| POST   | /api/bookings                 | USER      |
| GET    | /api/bookings/my-bookings     | USER      |
| PUT    | /api/bookings/:id/cancel      | USER      |
| GET    | /api/bookings/organizer       | ORGANIZER |
| GET    | /api/bookings                 | ADMIN     |

### Admin
| Method | Endpoint                          | Access |
|--------|-----------------------------------|--------|
| GET    | /api/admin/stats                  | ADMIN  |
| GET    | /api/admin/users                  | ADMIN  |
| GET    | /api/admin/organizers             | ADMIN  |
| PUT    | /api/admin/users/:id/toggle       | ADMIN  |
| DELETE | /api/admin/users/:id              | ADMIN  |

---

## 🗄️ Database Models (MongoDB)

- **User** — name, email, password (bcrypt), phone, address, role
- **Temple** — templeName, location, description, darshanStartTime, darshanEndTime, organizer (ref)
- **DarshanSlot** — temple (ref), date, startTime, endTime, totalSeats, availableSeats, price, poojaType
- **Booking** — user (ref), slot (ref), temple (ref), numberOfDevotees, totalAmount, bookingStatus, ticketId
- **Donation** — user (ref), temple (ref), amount, message, transactionId

---

## 🖥️ Pages

| Page                   | Route                    |
|------------------------|--------------------------|
| Home / Landing         | /                        |
| Login                  | /login                   |
| Register               | /register                |
| Browse Temples         | /temples                 |
| Temple Detail & Book   | /temples/:id             |
| My Bookings (User)     | /user/bookings           |
| Organizer Dashboard    | /organizer/dashboard     |
| Admin Dashboard        | /admin/dashboard         |

---

## ✅ Features Implemented

- [x] Devotee registration & secure login (JWT + bcrypt)
- [x] Role-based access: USER / ORGANIZER / ADMIN
- [x] Browse and search temples
- [x] View darshan slots per temple
- [x] Book darshan slots with seat management
- [x] View and cancel bookings
- [x] Unique ticket ID generation per booking
- [x] Organizer: Create & manage temples and slots
- [x] Admin: Manage users, organizers, bookings, stats
- [x] Real-time seat availability updates
- [x] Responsive UI with Bootstrap 5
- [x] Toast notifications
- [x] Protected routes (frontend + backend)

---

## 🎨 Architecture

**MVC Pattern (Backend)**
- **Model** — Mongoose schemas
- **View (Routes)** — Express route definitions
- **Controller** — Business logic handlers

**Component Architecture (Frontend)**
- Context API for global auth state
- Axios interceptors for auto-attaching JWT
- PrivateRoute for frontend route protection

---

*Built with ❤️ as a full-stack MERN project — DarshanEase*
