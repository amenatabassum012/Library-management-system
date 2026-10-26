import { useState, useEffect } from "react"; // Loads useState to remember data and useEffect to run code at a set time
import api from "../services/api"; // Loads the axios setup that talks to your server

function Transactions() { // The Transactions page component
  const [books, setBooks] = useState([]); // The books for the dropdown
  const [members, setMembers] = useState([]); // The members for the dropdown
  const [transactions, setTransactions] = useState([]); // The list of transactions for the table
  const [bookId, setBookId] = useState(""); // The id of the book chosen in the dropdown
  const [memberId, setMemberId] = useState(""); // The id of the member chosen in the dropdown
  const [error, setError] = useState(""); // A message shown if loading fails
  const [message, setMessage] = useState(""); // The success or error message under the form
  const [messageColor, setMessageColor] = useState("green"); // The colour of that message

  const loadData = async () => { // Gets books, members and transactions from your server
    try { // Try to run the code below
      const [bookRes, memberRes, transactionRes] = await Promise.all([ // Sends three requests at the same time and waits for all of them
        api.get("/books"), // Gets all books
        api.get("/members"), // Gets all members
        api.get("/transactions"), // Gets all transactions
      ]); // Ends the list of requests
      setBooks(bookRes.data); // Saves the books
      setMembers(memberRes.data); // Saves the members
      setTransactions(transactionRes.data); // Saves the transactions
      setError(""); // Clears any old error
    } catch (err) { // Runs if something goes wrong
      setError("Could not load data. Is the server running?"); // Saves a message to show
    } // Ends the catch block
  }; // Ends the function

  useEffect(() => { // Runs the code inside at a set time
    loadData(); // Loads everything
  }, []); // Empty brackets mean: run only once, when the page opens

  const handleIssue = async (e) => { // Runs when the issue form is submitted
    e.preventDefault(); // Stops the browser from reloading the page
    try { // Try to run the code below
      await api.post("/transactions/issue", { bookId, memberId }); // Sends the two ids to the issue address
      setMessage("Book issued successfully"); // Saves the success message
      setMessageColor("green"); // Makes the message green
      setBookId(""); // Resets the book dropdown
      setMemberId(""); // Resets the member dropdown
      loadData(); // Reloads everything, so copy counts and the table are correct
    } catch (err) { // Runs if the server rejects the request or is off
      setMessage(err.response?.data?.message || "Could not reach the server"); // Shows the reason, like "No copies available"
      setMessageColor("red"); // Makes the message red
    } // Ends the catch block
  }; // Ends the function

  const handleReturn = async (id) => { // Returns one book. It receives the transaction's id
    try { // Try to run the code below
      await api.put(`/transactions/${id}/return`); // Sends a PUT request to the return address
      setMessage("Book returned successfully"); // Saves the success message
      setMessageColor("green"); // Makes the message green
      loadData(); // Reloads everything, so copy counts and the table are correct
    } catch (err) { // Runs if something goes wrong
      setMessage(err.response?.data?.message || "Could not return the book"); // Shows the reason
      setMessageColor("red"); // Makes the message red
    } // Ends the catch block
  }; // Ends the function

  return ( // Returns the markup for this page
    <div>
      {/* One wrapper element */}
      <h2>Issue a Book</h2>
      {/* The form title */}
      <form onSubmit={handleIssue}>
        {/* The form. handleIssue runs when it is submitted */}
        <select value={bookId} onChange={(e) => setBookId(e.target.value)} required>
          {/* The book dropdown. value shows the chosen book. onChange saves a new choice */}
          <option value="">Select a book</option>
          {/* The first option has no value, so it cannot be submitted */}
          {books.map((book) => ( // Returns one option for every book
            <option key={book._id} value={book._id}>
              {/* The hidden value is the id, which your API needs */}
              {book.title} ({book.availableQuantity} available)
              {/* The visible text is the title and copies left */}
            </option>
          ))}
        </select>
        <select value={memberId} onChange={(e) => setMemberId(e.target.value)} required>
          {/* The member dropdown, same idea as above */}
          <option value="">Select a member</option>
          {/* The first option has no value */}
          {members.map((member) => ( // Returns one option for every member
            <option key={member._id} value={member._id}>
              {/* The hidden value is the member's id */}
              {member.name}
              {/* The visible text is the member's name */}
            </option>
          ))}
        </select>
        <button type="submit">Issue Book</button>
        {/* Submits the form */}
      </form>
      <p style={{ color: messageColor, minHeight: "20px" }}>{message}</p>
      {/* The success or error message under the form */}

      <h2>Transactions</h2>
      {/* The table title */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* Shows the loading error, only if there is one */}
      <table>
        {/* The transactions table */}
        <thead>
          {/* The header row */}
          <tr>
            <th>Book</th>
            <th>Member</th>
            <th>Issue Date</th>
            <th>Return Date</th>
            <th>Status</th>
            <th>Action</th>
            {/* The six column headings */}
          </tr>
        </thead>
        <tbody>
          {/* The table body, filled from the transactions list */}
          {transactions.length === 0 ? ( // Checks if the list is empty
            <tr>
              <td colSpan="6">No transactions yet</td>
              {/* One cell as wide as all six columns */}
            </tr>
          ) : ( // Otherwise show the transactions
            transactions.map((t) => ( // Returns one row for every transaction
              <tr key={t._id}>
                {/* One row. key is the transaction's id */}
                <td>{t.bookId ? t.bookId.title : t.bookTitle ? `${t.bookTitle} (deleted)` : "Deleted book"}</td>
                {/* Shows the live title. If the book is gone, shows the saved title with "(deleted)". Old rows with no saved title show "Deleted book" */}
                <td>{t.memberId ? t.memberId.name : t.memberName ? `${t.memberName} (deleted)` : "Deleted member"}</td>
                {/* The same idea for the member's name */}
                <td>{new Date(t.issueDate).toLocaleDateString()}</td>
                {/* The issue date in a readable form */}
                <td>{t.returnDate ? new Date(t.returnDate).toLocaleDateString() : "-"}</td>
                {/* The return date, or a dash if not returned yet */}
                <td>{t.status}</td>
                {/* The status: issued or returned */}
                <td>
                  {/* The action cell */}
                  {t.status === "issued" && (
                    <button onClick={() => handleReturn(t._id)}>Return</button>
                  )}
                  {/* The Return button shows only while the book is still out */}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  ); // Ends the markup
} // Ends the component

export default Transactions; // Shares this page with App.jsx