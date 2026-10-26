const dns = require("dns"); // Loads Node's built-in DNS tool, which finds server addresses
dns.setServers(["8.8.8.8", "8.8.4.4"]); // Makes Node use Google's DNS instead of your network's DNS
const mongoose = require("mongoose"); // Loads mongoose, the tool that talks to MongoDB

const connectDB = async () => { // A function that connects to the database. async means it waits for the connection
  try { // Try to run the code below
    await mongoose.connect(process.env.MONGO_URI); // Connects using the address stored in the .env file
    console.log("MongoDB connected"); // Prints a message if the connection works
  } catch (error) { // Runs only if the connection fails
    console.log("MongoDB error:", error.message); // Prints the reason it failed
    process.exit(1); // Stops the server, because it cannot work without a database
  } // Ends the catch block
}; // Ends the function

module.exports = connectDB; // Makes this function available to other files