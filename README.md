# Library Management System

A full-stack web application for managing books, members and library transactions. Built with the MERN stack as an academic project.

## Features

- Dashboard with total books, total members, books issued and books returned
- Add, edit, view and delete books
- Add and view members, with validation for email and phone number
- Issue a book to a member and mark it as returned
- Stock tracking: a book cannot be issued when no copy is available
- Transaction history with book titles and member names

## Tech Stack

| Technology | Purpose |
|---|---|
| React (Vite) | Frontend user interface |
| React Router | Switching between pages |
| Axios | Sending requests to the API |
| Node.js | Backend runtime |
| Express.js | REST API |
| MongoDB Atlas | Database |
| Mongoose | Models and validation |

## Folder Structure

```
library-management-system/
  client/
    src/
      components/    Navbar
      pages/         Dashboard, Books, Members, Transactions
      services/      api.js (axios setup)
      App.jsx
  server/
    config/          db.js (database connection)
    models/          Book, Member, Transaction
    controllers/     Logic for each request
    routes/          API addresses
    server.js
  README.md
```

## Getting Started

### Requirements

- Node.js (LTS version)
- A MongoDB Atlas account with a free cluster

### 1. Set up the server

```
cd server
npm install
```

Create a file named `.env` inside `server` with these lines:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
```

Use your own connection string from Atlas, and add the database name `library` after `.mongodb.net/`. Never share this file or upload it to GitHub.

Start the server:

```
npm run dev
```

You should see "Server running on port 5000" and "MongoDB connected".

### 2. Set up the client

Open a second terminal:

```
cd client
npm install
npm run dev
```

Open the link shown in the terminal, usually `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/books | Get all books |
| POST | /api/books | Add a book |
| PUT | /api/books/:id | Update a book |
| DELETE | /api/books/:id | Delete a book |
| GET | /api/members | Get all members |
| POST | /api/members | Add a member |
| GET | /api/transactions | Get all transactions |
| POST | /api/transactions/issue | Issue a book |
| PUT | /api/transactions/:id/return | Return a book |
| GET | /api/dashboard | Get dashboard statistics |

## Validation Rules

- A book needs a title, author, unique ISBN and a quantity of at least 1.
- A member needs a name, a unique valid email and a 10-digit phone number.
- A book cannot be issued if no copy is available.
- A book cannot be returned twice.
- A book's quantity cannot be set lower than the number of copies currently issued.

## Testing

Tested manually with Postman and in the browser:

- Create, read, update and delete books
- Create and view members
- Issue and return books, with stock counts updating
- Rejection of duplicate ISBNs, duplicate emails and invalid phone numbers
- Error message when the server is not running

## Screenshots

![Dashboard](image.png)
![BOOKS](image-1.png)
![Members](image-2.png)
![Transactions](image-3.png)

## Future Enhancements

- Admin login and authentication
- Fine calculation for late returns
- Search and filtering
- Book cover images
- Email notifications
- Pagination
- Reports and analytics
- Deployment using cloud services

## Author

Amena Tabassum
B.E. Computer Science and Engineering
Stanley College of Engineering and Technology for Women, Hyderabad