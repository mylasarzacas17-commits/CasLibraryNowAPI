# 📚 CasLibraryNow API

A full-featured **Library Management REST API** built with Node.js, Express, and MongoDB. Manage books, members, and loans with JWT authentication.

---

## 🚀 Features

- **Books** — Add, update, delete, search, and filter books
- **Members** — Register, manage library members with membership IDs
- **Loans** — Borrow/return books with automatic overdue detection and fines
- **Auth** — JWT-based authentication with admin/member roles
- **Security** — Helmet, CORS, bcrypt password hashing

---

## 🛠️ Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs, Helmet, CORS, Morgan

---

## 📦 Installation

```bash
git clone https://github.com/mylasarzacas17-commits/CasLibraryNowAPI.git
cd CasLibraryNowAPI
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

---

## 🔐 Environment Variables

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/caslibrarynow
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new member |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get current user (protected) |

### Books
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Get all books (supports `?search=`, `?genre=`, `?available=true`) |
| GET | `/api/books/:id` | Get single book |
| POST | `/api/books` | Add a book *(admin only)* |
| PUT | `/api/books/:id` | Update a book *(admin only)* |
| DELETE | `/api/books/:id` | Delete a book *(admin only)* |

### Members
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/members` | Get all members *(admin only)* |
| GET | `/api/members/:id` | Get single member |
| PUT | `/api/members/:id` | Update member |
| DELETE | `/api/members/:id` | Delete member *(admin only)* |

### Loans
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/loans` | Get all loans *(admin only)* |
| GET | `/api/loans/overdue` | Get overdue loans *(admin only)* |
| GET | `/api/loans/:id` | Get single loan |
| POST | `/api/loans/borrow` | Borrow a book |
| PUT | `/api/loans/:id/return` | Return a book |

---

## 🧾 Sample Request — Borrow a Book

```json
POST /api/loans/borrow
Authorization: Bearer <token>

{
  "bookId": "64abc123...",
  "memberId": "64def456...",
  "dueDate": "2025-07-01"
}
```

---

## ⚠️ Fines

Overdue books are fined **₱5 per day** past the due date, calculated automatically on return.

---

## 📄 License

MIT © Myla Cas
