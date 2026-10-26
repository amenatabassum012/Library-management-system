const Book = require("../models/Book"); // Loads the Book model so we can use the database
const Transaction = require("../models/Transaction"); // Loads the Transaction model, to check for issued copies before deleting
const getBooks = async (req, res) => { // Function to get all books. req is the request, res is the reply
  try { // Try to run the code below
    const books = await Book.find(); // Asks MongoDB for every book and waits for the answer
    res.status(200).json(books); // Sends the books back as JSON. 200 means success
  } catch (error) { // Runs if something goes wrong
    res.status(500).json({ message: error.message }); // 500 means server error. Sends the reason back
  } // Ends the catch block
}; // Ends the function

const addBook = async (req, res) => { // Function to add a new book
  try { // Try to run the code below
    const data = req.body; // Takes the book details sent by the user
    if (data.availableQuantity === undefined) { // Checks if available quantity was not sent
      data.availableQuantity = data.quantity; // A new book starts with all copies available
    } // Ends the if block
    const book = await Book.create(data); // Saves the new book in MongoDB
    res.status(201).json(book); // Sends the saved book back. 201 means created
  } catch (error) { // Runs if something goes wrong
    if (error.code === 11000) { // 11000 is MongoDB's code for a duplicate value
      return res.status(400).json({ message: "A book with this ISBN already exists" }); // Tells the user the ISBN is taken
    } // Ends the duplicate check
    res.status(400).json({ message: error.message }); // 400 means bad data, like a missing title
  } // Ends the catch block
}; // Ends the function

const updateBook = async (req, res) => { // Function to edit an existing book
  try { // Try to run the code below
    const book = await Book.findById(req.params.id); // Finds the book by the id in the address
    if (!book) { // Checks if no book was found
      return res.status(404).json({ message: "Book not found" }); // 404 means not found
    } // Ends the check

    const { title, author, category, isbn, quantity } = req.body; // Takes only the fields we allow to be edited

    if (quantity !== undefined) { // Checks if a new quantity was sent
      const issued = book.quantity - book.availableQuantity; // Works out how many copies are out right now
      if (quantity < issued) { // Checks if the new total is lower than the copies already out
        return res.status(400).json({ message: `Quantity cannot be less than ${issued}, the copies currently issued` }); // Rejects it
      } // Ends the check
      book.availableQuantity = quantity - issued; // Keeps the shelf count correct after the change
      book.quantity = quantity; // Saves the new total
    } // Ends the quantity block

    if (title !== undefined) book.title = title; // Updates the title if it was sent
    if (author !== undefined) book.author = author; // Updates the author if it was sent
    if (category !== undefined) book.category = category; // Updates the category if it was sent
    if (isbn !== undefined) book.isbn = isbn; // Updates the ISBN if it was sent

    await book.save(); // Saves the changes and runs the model's validation rules
    res.status(200).json(book); // Sends the updated book back
  } catch (error) { // Runs if something goes wrong
    if (error.code === 11000) { // 11000 is MongoDB's code for a duplicate value
      return res.status(400).json({ message: "A book with this ISBN already exists" }); // Tells the user the ISBN is taken
    } // Ends the duplicate check
    res.status(400).json({ message: error.message }); // Sends the reason back
  } // Ends the catch block
}; // Ends the function
const deleteBook = async (req, res) => { // Function to delete a book
  try { // Try to run the code below
    const issuedCount = await Transaction.countDocuments({ bookId: req.params.id, status: "issued" }); // Counts the copies of this book that are still out
    if (issuedCount > 0) { // Checks if any copy has not come back
      return res.status(400).json({ message: `${issuedCount} copy(ies) of this book are still issued. Return them first.` }); // Blocks the delete and says how many are out
    } // Ends the check

    const book = await Book.findByIdAndDelete(req.params.id); // Finds the book by id and removes it
    if (!book) { // Checks if no book was found
      return res.status(404).json({ message: "Book not found" }); // 404 means not found
    } // Ends the check
    res.status(200).json({ message: "Book deleted" }); // Confirms the deletion
  } catch (error) { // Runs if something goes wrong
    res.status(400).json({ message: error.message }); // Sends the reason back
  } // Ends the catch block
}; // Ends the function
module.exports = { getBooks, addBook, updateBook, deleteBook }; // Shares the four functions with other files