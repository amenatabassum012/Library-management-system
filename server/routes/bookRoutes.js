const express = require("express"); // Loads Express so we can make a router
const router = express.Router(); // A router is a small group of related addresses
const { // Starts picking the functions we need from the controller
  getBooks, // The function that reads all books
  addBook, // The function that creates a book
  updateBook, // The function that edits a book
  deleteBook, // The function that removes a book
} = require("../controllers/bookController"); // Loads them from the controller file

router.get("/", getBooks); // GET /api/books runs getBooks
router.post("/", addBook); // POST /api/books runs addBook
router.put("/:id", updateBook); // PUT /api/books/123 runs updateBook. :id is the book's id
router.delete("/:id", deleteBook); // DELETE /api/books/123 runs deleteBook

module.exports = router; // Shares the router with server.js