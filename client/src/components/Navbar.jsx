import { NavLink } from "react-router-dom"; // Loads NavLink, a link that switches pages without reloading

function Navbar() { // A component is a function that returns a piece of the page
  return ( // Returns the HTML-like markup for the menu
    <header>
      {/* The top bar. Your old header styles apply to it */}
      <h1>Library Management System</h1>
      {/* The main title */}
      <nav>
        {/* Holds the menu links */}
        <NavLink to="/" end>Dashboard</NavLink>
        {/* Goes to the home address. "end" stops this link from looking active on every page */}
        <NavLink to="/books">Books</NavLink>
        {/* Goes to the /books address */}
        <NavLink to="/members">Members</NavLink>
        {/* Goes to the /members address */}
        <NavLink to="/transactions">Transactions</NavLink>
        {/* Goes to the /transactions address */}
      </nav>
    </header>
  ); // Ends the markup
} // Ends the component

export default Navbar; // Shares this component with other files