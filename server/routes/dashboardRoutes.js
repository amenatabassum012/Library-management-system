const express = require("express"); // Loads Express so we can make a router
const router = express.Router(); // A router is a small group of related addresses
const Book = require("../models/Book"); // Loads the Book model, so we can count books
const Member = require("../models/Member"); // Loads the Member model, so we can count members
const Transaction = require("../models/Transaction"); // Loads the Transaction model, so we can count transactions

router.get("/", async (req, res) => { // GET /api/dashboard runs this function. async means it waits for the database
  try { // Try to run the code below
    const [totalBooks, totalMembers, issuedBooks, returnedBooks] = await Promise.all([ // Runs four counts at the same time and waits for all of them
      Book.countDocuments(), // Counts every book
      Member.countDocuments(), // Counts every member
      Transaction.countDocuments({ status: "issued" }), // Counts transactions with status issued
      Transaction.countDocuments({ status: "returned" }), // Counts transactions with status returned
    ]); // Ends the list of counts

    res.status(200).json({ totalBooks, totalMembers, issuedBooks, returnedBooks }); // Sends the four numbers back as JSON
  } catch (error) { // Runs if something goes wrong
    res.status(500).json({ message: error.message }); // 500 means server error. Sends the reason back
  } // Ends the catch block
}); // Ends this route

module.exports = router; // Shares the router with server.js