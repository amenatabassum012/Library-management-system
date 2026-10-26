const Transaction = require("../models/Transaction"); // Loads the Transaction model
const Book = require("../models/Book"); // Loads the Book model, because issuing changes book copies
const Member = require("../models/Member"); // Loads the Member model, to check the member exists

const issueBook = async (req, res) => { // Function to give a book to a member
  try { // Try to run the code below
    const { bookId, memberId } = req.body; // Takes the book id and member id sent by the user

    const book = await Book.findById(bookId); // Looks for the book in the database
    if (!book) { // Checks if no book was found
      return res.status(404).json({ message: "Book not found" }); // 404 means not found
    } // Ends the check

    const member = await Member.findById(memberId); // Looks for the member in the database
    if (!member) { // Checks if no member was found
      return res.status(404).json({ message: "Member not found" }); // 404 means not found
    } // Ends the check

    if (book.availableQuantity < 1) { // Checks if no copy is on the shelf
      return res.status(400).json({ message: "No copies available" }); // Rejects the request
    } // Ends the check

    const transaction = await Transaction.create({ bookId, memberId }); // Saves the new transaction. Status becomes "issued" by default
    book.availableQuantity -= 1; // Reduces the available copies by one
    await book.save(); // Saves the updated book in the database

    res.status(201).json(transaction); // Sends the transaction back. 201 means created
  } catch (error) { // Runs if something goes wrong, like a badly formed id
    res.status(400).json({ message: error.message }); // Sends the reason back
  } // Ends the catch block
}; // Ends the function

const returnBook = async (req, res) => { // Function to take a book back
  try { // Try to run the code below
    const transaction = await Transaction.findById(req.params.id); // Finds the transaction using the id in the address
    if (!transaction) { // Checks if no transaction was found
      return res.status(404).json({ message: "Transaction not found" }); // 404 means not found
    } // Ends the check

    if (transaction.status === "returned") { // Checks if the book was already returned
      return res.status(400).json({ message: "Book already returned" }); // Stops a double return
    } // Ends the check

    transaction.status = "returned"; // Marks the transaction as returned
    transaction.returnDate = new Date(); // Sets the return date to now
    await transaction.save(); // Saves the changes in the database

    await Book.findByIdAndUpdate(transaction.bookId, { $inc: { availableQuantity: 1 } }); // Adds one copy back to the shelf. $inc means increase by

    res.status(200).json(transaction); // Sends the updated transaction back
  } catch (error) { // Runs if something goes wrong
    res.status(400).json({ message: error.message }); // Sends the reason back
  } // Ends the catch block
}; // Ends the function

const getTransactions = async (req, res) => { // Function to list all transactions
  try { // Try to run the code below
    const transactions = await Transaction.find() // Asks MongoDB for every transaction
      .populate("bookId", "title author") // Replaces the book id with the book's title and author
      .populate("memberId", "name email") // Replaces the member id with the member's name and email
      .sort({ createdAt: -1 }); // Shows the newest transaction first
    res.status(200).json(transactions); // Sends the list back. 200 means success
  } catch (error) { // Runs if something goes wrong
    res.status(500).json({ message: error.message }); // 500 means server error
  } // Ends the catch block
}; // Ends the function

module.exports = { issueBook, returnBook, getTransactions }; // Shares the three functions with other files