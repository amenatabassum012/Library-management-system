const Member = require("../models/Member"); // Loads the Member model so we can use the database
const Transaction = require("../models/Transaction"); // Loads the Transaction model, to check for issued books before deleting

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

const updateMember = async (req, res) => { // Function to edit an existing member
  try { // Try to run the code below
    const member = await Member.findById(req.params.id); // Finds the member by the id in the address
    if (!member) { // Checks if no member was found
      return res.status(404).json({ message: "Member not found" }); // 404 means not found
    } // Ends the check

    const { name, email, phone } = req.body; // Takes only the fields we allow to be edited
    if (name !== undefined) member.name = name; // Updates the name if it was sent
    if (email !== undefined) member.email = email; // Updates the email if it was sent
    if (phone !== undefined) member.phone = phone; // Updates the phone if it was sent

    await member.save(); // Saves the changes and runs the model's validation rules again
    res.status(200).json(member); // Sends the updated member back
  } catch (error) { // Runs if something goes wrong
    if (error.code === 11000) { // 11000 is MongoDB's code for a duplicate value
      return res.status(400).json({ message: "A member with this email already exists" }); // Tells the user the email is taken
    } // Ends the duplicate check
    res.status(400).json({ message: error.message }); // Sends the reason back, like "Phone must be 10 digits"
  } // Ends the catch block
}; // Ends the function

const deleteMember = async (req, res) => { // Function to delete a member
  try { // Try to run the code below
    const issuedCount = await Transaction.countDocuments({ memberId: req.params.id, status: "issued" }); // Counts the books this member still has out
    if (issuedCount > 0) { // Checks if the member still holds any books
      return res.status(400).json({ message: "This member still has issued books. Return them first." }); // Blocks the delete
    } // Ends the check

    const member = await Member.findByIdAndDelete(req.params.id); // Finds the member by id and removes them
    if (!member) { // Checks if no member was found
      return res.status(404).json({ message: "Member not found" }); // 404 means not found
    } // Ends the check
    res.status(200).json({ message: "Member deleted" }); // Confirms the deletion
  } catch (error) { // Runs if something goes wrong
    res.status(400).json({ message: error.message }); // Sends the reason back
  } // Ends the catch block
}; // Ends the function

module.exports = { getMembers, addMember, updateMember, deleteMember }; // Shares the four functions with other files