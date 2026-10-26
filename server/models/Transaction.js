const mongoose = require("mongoose"); // Loads mongoose so we can define a model

const transactionSchema = new mongoose.Schema( // The blueprint of a transaction: one book given to one member
  { // Starts the list of fields
    bookId: { // Which book was issued
      type: mongoose.Schema.Types.ObjectId, // The value is the _id of a document in MongoDB
      ref: "Book", // Says this id points to a document in the Book collection
      required: [true, "Book is required"], // A transaction cannot be saved without a book
    }, // Ends the bookId field
    memberId: { // Which member took the book
      type: mongoose.Schema.Types.ObjectId, // The value is the _id of a document in MongoDB
      ref: "Member", // Says this id points to a document in the Member collection
      required: [true, "Member is required"], // A transaction cannot be saved without a member
    }, // Ends the memberId field
        bookTitle: { // A saved copy of the book's title, kept even if the book is deleted later
      type: String, // The value must be text
    }, // Ends the bookTitle field
    memberName: { // A saved copy of the member's name, kept even if the member is deleted later
      type: String, // The value must be text
    }, // Ends the memberName field
    issueDate: { // The date the book was given out
      type: Date, // The value must be a date
      default: Date.now, // If no date is sent, today's date is used
    }, // Ends the issueDate field
    returnDate: { // The date the book came back
      type: Date, // The value must be a date
      default: null, // Empty until the book is returned
    }, // Ends the returnDate field
    status: { // Whether the book is still out or back
      type: String, // The value must be text
      enum: ["issued", "returned"], // Only these two values are allowed
      default: "issued", // A new transaction starts as issued
    }, // Ends the status field
  }, // Ends the list of fields
  { timestamps: true } // Mongoose adds createdAt and updatedAt automatically
); // Ends the schema

module.exports = mongoose.model("Transaction", transactionSchema); // Creates the Transaction model and shares it with other files