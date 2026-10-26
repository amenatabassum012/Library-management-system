import { useState, useEffect } from "react"; // Loads useState to remember data and useEffect to run code at a set time
import api from "../services/api"; // Loads the axios setup that talks to your server
const quotes = [ // A list of quotes. One is shown each day
  { text: "I cannot live without books.", author: "Thomas Jefferson" }, // First quote
  { text: "I have always imagined that Paradise will be a kind of library.", author: "Jorge Luis Borges" }, // Second quote
  { text: "There is no Frigate like a Book to take us Lands away.", author: "Emily Dickinson" }, // Third quote
]; // Ends the list

const todaysQuote = quotes[new Date().getDate() % quotes.length]; // Picks one by the day of the month. The % keeps the number inside the list size
function Dashboard() { // The Dashboard page component
  const [stats, setStats] = useState({ // The four numbers we remember. They start at zero
    totalBooks: 0, // Number of books
    totalMembers: 0, // Number of members
    issuedBooks: 0, // Number of books currently out
    returnedBooks: 0, // Number of books that came back
  }); // Ends the starting values
  const [error, setError] = useState(""); // A message shown if loading fails

  useEffect(() => { // Runs the code inside at a set time
    const loadStats = async () => { // Gets the four numbers from your server
      try { // Try to run the code below
        const response = await api.get("/dashboard"); // Sends a GET request to /api/dashboard
        setStats(response.data); // Saves the numbers. React redraws the boxes
        setError(""); // Clears any old error
      } catch (err) { // Runs if something goes wrong
        setError("Could not load dashboard. Is the server running?"); // Saves a message to show
      } // Ends the catch block
    }; // Ends the function
    loadStats(); // Runs the function
  }, []); // Empty brackets mean: run only once, when the page opens

  return ( // Returns the markup for this page
    <div>
      {/* One wrapper element */}
      <h2>Dashboard</h2>
      {/* The page title */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* Shows the loading error, only if there is one */}
      <section className="dashboard">
        {/* The row that holds the four boxes. className is how React names a CSS class */}
        <div className="stat-card">
          {/* One box */}
          <h3>{stats.totalBooks}</h3>
          {/* The big number */}
          <p>Total Books</p>
          {/* The label */}
        </div>
        <div className="stat-card">
          <h3>{stats.totalMembers}</h3>
          <p>Total Members</p>
          {/* The members box */}
        </div>
        <div className="stat-card">
          <h3>{stats.issuedBooks}</h3>
          <p>Books Issued</p>
          {/* The issued books box */}
        </div>
        <div className="stat-card">
          <h3>{stats.returnedBooks}</h3>
          <p>Books Returned</p>
          {/* The returned books box */}
        </div>
      </section>
            <blockquote className="quote">
        {/* The quote box. className connects it to the CSS below */}
        <p>“{todaysQuote.text}”</p>
        {/* The quote text, inside curly quotation marks */}
        <footer>— {todaysQuote.author}</footer>
        {/* The name of the person who said it */}
      </blockquote>
    </div>
  ); // Ends the markup
} // Ends the component

export default Dashboard; // Shares this page with App.jsx