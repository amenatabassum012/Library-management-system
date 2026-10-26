const Member = require("../models/Member"); // Loads the Member model so we can use the database

const getMembers = async (req, res) => { // Function to get all members
  try { // Try to run the code below
    const members = await Member.find(); // Asks MongoDB for every member and waits for the answer
    res.status(200).json(members); // Sends the members back as JSON. 200 means success
  } catch (error) { // Runs if something goes wrong
    res.status(500).json({ message: error.message }); // 500 means server error. Sends the reason back
  } // Ends the catch block
}; // Ends the function

const addMember = async (req, res) => { // Function to add a new member
  try { // Try to run the code below
    const member = await Member.create(req.body); // Saves the member details sent by the user
    res.status(201).json(member); // Sends the saved member back. 201 means created
  } catch (error) { // Runs if something goes wrong
    if (error.code === 11000) { // 11000 is MongoDB's code for a duplicate value
      return res.status(400).json({ message: "A member with this email already exists" }); // Tells the user the email is taken
    } // Ends the duplicate check
    res.status(400).json({ message: error.message }); // 400 means bad data, like a wrong phone number
  } // Ends the catch block
}; // Ends the function

module.exports = { getMembers, addMember }; // Shares the two functions with other files