require("dotenv").config(); // Loads the values from your .env file
const express = require("express"); // Loads Express, the tool that builds the server
const cors = require("cors"); // Loads CORS, which lets your HTML page call this server
const connectDB = require("./config/db"); // Loads the database function we just wrote

const app = express(); // Creates your server

connectDB(); // Connects to MongoDB
const bookRoutes = require("./routes/bookRoutes"); // Loads the book routes we just wrote
const memberRoutes = require("./routes/memberRoutes"); // Loads the member routes we just wrote
const transactionRoutes = require("./routes/transactionRoutes"); // Loads the transaction routes we just wrote
const dashboardRoutes = require("./routes/dashboardRoutes"); // Loads the dashboard route we just wrote

app.use(cors()); // Allows requests from your frontend
app.use(express.json()); // Lets the server read JSON data sent to it
app.use("/api/books", bookRoutes); // Every address starting with /api/books goes to the book routes
app.use("/api/members", memberRoutes); // Every address starting with /api/members goes to the member routes
app.use("/api/transactions", transactionRoutes); // Every address starting with /api/transactions goes to the transaction
app.use("/api/dashboard", dashboardRoutes); // Every address starting with /api/dashboard goes to the dashboard route
app.get("/", (req, res) => { // Runs when someone opens the main address
  res.send("Library API is running"); // Sends this text back as the reply
}); // Ends this route

const PORT = process.env.PORT || 5000; // Uses the port from .env, or 5000 if missing

app.listen(PORT, () => { // Starts the server on that port
  console.log(`Server running on port ${PORT}`); // Prints a message when the server starts
}); // Ends the listen function