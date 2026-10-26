const mongoose = require("mongoose"); // Loads mongoose, which lets us define data models

const bookSchema = new mongoose.Schema( // A schema is the blueprint of one book
  { // Starts the list of fields
    title: { // The book title field
      type: String, // The title is text
      required: [true, "Title is required"], // Saving fails if the title is missing
      trim: true, // Removes extra spaces at the start and end
    }, // Ends the title field
    author: { // The author field
      type: String, // The author is text
      required: [true, "Author is required"], // Saving fails if the author is missing
      trim: true, // Removes extra spaces
    }, // Ends the author field
    category: { // The category field, like Science or Fiction
      type: String, // The category is text
      required: [true, "Category is required"], // Saving fails if the category is missing
      trim: true, // Removes extra spaces
    }, // Ends the category field
    isbn: { // The ISBN, a unique number for each book
      type: String, // Stored as text, because ISBNs can have dashes
      required: [true, "ISBN is required"], // Saving fails if the ISBN is missing
      unique: true, // No two books can have the same ISBN
      trim: true, // Removes extra spaces
    }, // Ends the isbn field
    quantity: { // Total copies the library owns
      type: Number, // This is a number
      required: [true, "Quantity is required"], // Saving fails if it is missing
      min: [1, "Quantity must be at least 1"], // Must be 1 or more
    }, // Ends the quantity field
    availableQuantity: { // Copies currently on the shelf, not issued
      type: Number, // This is a number
      min: [0, "Available quantity cannot be negative"], // Can never go below 0
    }, // Ends the availableQuantity field
  }, // Ends the list of fields
  { timestamps: true } // Adds createdAt and updatedAt dates automatically
); // Ends the schema


module.exports = mongoose.model("Book", bookSchema); // Creates the Book model and shares it with other files