import { Routes, Route, useLocation } from "react-router-dom"; // Loads the routing tools. useLocation tells us which page we are on
import Navbar from "./components/Navbar"; // Loads the menu bar
import Dashboard from "./pages/Dashboard"; // Loads the Dashboard page
import Books from "./pages/Books"; // Loads the Books page
import Members from "./pages/Members"; // Loads the Members page
import Transactions from "./pages/Transactions"; // Loads the Transactions page

const backgrounds = { // Links each address to a background class
  "/": "bg-dashboard", // Dashboard gets image 1
  "/books": "bg-books", // Books gets image 2
  "/members": "bg-members", // Members gets image 3
  "/transactions": "bg-transactions", // Transactions gets the book pattern
}; // Ends the list

function App() { // The main component. It holds the whole app
  const location = useLocation(); // Gets the current address
  const bgClass = backgrounds[location.pathname] || ""; // Finds the background class for this page, or none

  return ( // Returns the markup for the whole app
    <div className={`app ${bgClass}`}>
      {/* The wrapper. Its class changes with the page, and the CSS uses it to pick the background */}
      <Navbar />
      {/* The menu bar. It stays on every page */}
      <main>
        {/* The area where the current page appears */}
        <Routes>
          {/* Holds the list of addresses and their pages */}
          <Route path="/" element={<Dashboard />} />
          {/* The home address shows the Dashboard */}
          <Route path="/books" element={<Books />} />
          {/* /books shows the Books page */}
          <Route path="/members" element={<Members />} />
          {/* /members shows the Members page */}
          <Route path="/transactions" element={<Transactions />} />
          {/* /transactions shows the Transactions page */}
        </Routes>
      </main>
    </div>
  ); // Ends the markup
} // Ends the component

export default App; // Shares the app with main.jsx