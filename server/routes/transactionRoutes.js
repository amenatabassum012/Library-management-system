const express = require("express"); // Loads Express so we can make a router
const router = express.Router(); // A router is a small group of related addresses
const { issueBook, returnBook, getTransactions } = require("../controllers/transactionController"); // Loads the three transaction functions

router.get("/", getTransactions); // GET /api/transactions runs getTransactions
router.post("/issue", issueBook); // POST /api/transactions/issue runs issueBook
router.put("/:id/return", returnBook); // PUT /api/transactions/123/return runs returnBook. :id is the transaction's id

module.exports = router; // Shares the router with server.js