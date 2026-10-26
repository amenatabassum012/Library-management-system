const mongoose = require("mongoose"); // Loads mongoose so we can define a model

const memberSchema = new mongoose.Schema( // The blueprint of a member: what fields they have
  { // Starts the list of fields
    name: { // The member's name
      type: String, // The value must be text
      required: [true, "Name is required"], // A member cannot be saved without a name
      trim: true, // Removes extra spaces at the start and end
    }, // Ends the name field
    email: { // The member's email address
      type: String, // The value must be text
      required: [true, "Email is required"], // Email is compulsory
      unique: true, // Two members cannot share the same email
      lowercase: true, // Saves the email in small letters, so A@x.com and a@x.com count as the same
      trim: true, // Removes extra spaces
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"], // Checks the email looks like name@site.com
    }, // Ends the email field
    phone: { // The member's phone number
      type: String, // Stored as text, because phone numbers can start with zero
      required: [true, "Phone is required"], // Phone is compulsory
      trim: true, // Removes extra spaces
      match: [/^[0-9]{10}$/, "Phone must be 10 digits"], // Allows exactly 10 digits and nothing else
    }, // Ends the phone field
    membershipDate: { // The date the person became a member
      type: Date, // The value must be a date
      default: Date.now, // If no date is sent, today's date is used
    }, // Ends the membershipDate field
  }, // Ends the list of fields
  { timestamps: true } // Mongoose adds createdAt and updatedAt automatically
); // Ends the schema

module.exports = mongoose.model("Member", memberSchema); // Creates the Member model and shares it with other files