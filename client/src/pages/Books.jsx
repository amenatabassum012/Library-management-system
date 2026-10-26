import { useState, useEffect } from "react"; // Loads useState to remember data and useEffect to run code at a set time
import api from "../services/api"; // Loads the axios setup that talks to your server

const emptyForm = { title: "", author: "", category: "", isbn: "", quantity: "" }; // The form in its empty state. We reuse it to clear the form

function Books() { // The Books page component
  const [books, setBooks] = useState([]); // The list of books we remember
  const [error, setError] = useState(""); // A message shown if loading fails
  const [form, setForm] = useState(emptyForm); // The values currently typed in the form boxes
  const [editingId, setEditingId] = useState(null); // The id of the book being edited. null means we are adding
  const [message, setMessage] = useState(""); // The success or error message under the form
  const [messageColor, setMessageColor] = useState("green"); // The colour of that message

  const loadBooks = async () => { // Gets the books from your server
    try { // Try to run the code below
      const response = await api.get("/books"); // Sends a GET request to /api/books
      setBooks(response.data); // Saves the list. React redraws the table
      setError(""); // Clears any old error
    } catch (err) { // Runs if something goes wrong
      setError("Could not load books. Is the server running?"); // Saves a message to show
    } // Ends the catch block
  }; // Ends the function

  useEffect(() => { // Runs the code inside at a set time
    loadBooks(); // Loads the books
  }, []); // Empty brackets mean: run only once, when the page opens

  const handleChange = (e) => { // Runs every time someone types in a form box
    setForm({ ...form, [e.target.name]: e.target.value }); // Copies the form, then changes only the box that was typed in. The box's name tells us which one
  }; // Ends the function

  const resetForm = () => { // Puts the form back to its "add a book" state
    setForm(emptyForm); // Clears all the boxes
    setEditingId(null); // Forgets the book we were editing
  }; // Ends the function

  const startEdit = (book) => { // Fills the form with a book's details
    setForm({ // Sets every box at once
      title: book.title, // The title
      author: book.author, // The author
      category: book.category || "", // The category, or empty
      isbn: book.isbn, // The ISBN
      quantity: book.quantity, // The total copies
    }); // Ends the form values
    setEditingId(book._id); // Remembers which book we are editing
    setMessage(""); // Clears any old message
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scrolls up to the form
  }; // Ends the function

  const handleSubmit = async (e) => { // Runs when the form is submitted
    e.preventDefault(); // Stops the browser from reloading the page
    const bookData = { ...form, quantity: Number(form.quantity) }; // Copies the form and turns quantity from text into a number
    try { // Try to run the code below
      if (editingId) { // Checks if we are editing
        await api.put(`/books/${editingId}`, bookData); // Sends a PUT request to update the book
        setMessage("Book updated successfully"); // Saves the success message
      } else { // Otherwise we are adding
        await api.post("/books", bookData); // Sends a POST request to create the book
        setMessage("Book added successfully"); // Saves the success message
      } // Ends the check
      setMessageColor("green"); // Makes the message green
      resetForm(); // Clears the form
      loadBooks(); // Reloads the table so the change appears
    } catch (err) { // Runs if the server rejects the request or is off
      setMessage(err.response?.data?.message || "Could not reach the server"); // Shows the server's reason, or a simple message
      setMessageColor("red"); // Makes the message red
    } // Ends the catch block
  }; // Ends the function

  const handleDelete = async (id) => { // Deletes one book. It receives the book's id
    if (!window.confirm("Delete this book?")) { // Asks the user to confirm
      return; // Stops here if they cancel
    } // Ends the check
    try { // Try to run the code below
      await api.delete(`/books/${id}`); // Sends a DELETE request to your server
      loadBooks(); // Reloads the table so the book disappears
    } catch (err) { // Runs if something goes wrong
      alert(err.response?.data?.message || "Could not delete the book"); // Shows the reason
    } // Ends the catch block
  }; // Ends the function

  return ( // Returns the markup for this page
    <div>
      {/* One wrapper element */}
      <h2>{editingId ? "Edit Book" : "Add a Book"}</h2>
      {/* The heading changes depending on whether we are editing */}
      <form onSubmit={handleSubmit}>
        {/* The form. handleSubmit runs when it is submitted */}
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        {/* Title box. value shows the remembered text. onChange updates it as you type */}
        <input name="author" placeholder="Author" value={form.author} onChange={handleChange} required />
        {/* Author box */}
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        {/* Category box. Not required */}
        <input name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleChange} required />
        {/* ISBN box */}
        <input name="quantity" type="number" min="1" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
        {/* Quantity box. min="1" blocks zero and negatives */}
        <button type="submit">{editingId ? "Update Book" : "Add Book"}</button>
        {/* The button text changes while editing */}
        {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
        {/* The Cancel button only appears while editing */}
      </form>
      <p style={{ color: messageColor, minHeight: "20px" }}>{message}</p>
      {/* The success or error message under the form */}

      <h2>Books List</h2>
      {/* The table title */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* Shows the loading error, only if there is one */}
      <table>
        {/* The books table */}
        <thead>
          {/* The header row */}
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Action</th>
            {/* The five column headings */}
          </tr>
        </thead>
        <tbody>
          {/* The table body, filled from the books list */}
          {books.length === 0 ? ( // Checks if the list is empty
            <tr>
              <td colSpan="5">No books found</td>
              {/* One cell as wide as all five columns */}
            </tr>
          ) : ( // Otherwise show the books
            books.map((book) => ( // Returns one row for every book
              <tr key={book._id}>
                {/* One row. key is the book's id, so React can track it */}
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category || "-"}</td>
                <td>{book.availableQuantity} / {book.quantity}</td>
                {/* The four values for this book */}
                <td>
                  {/* The action cell */}
                  <button onClick={() => startEdit(book)}>Edit</button>
                  {/* Fills the form with this book */}
                  <button onClick={() => handleDelete(book._id)}>Delete</button>
                  {/* Deletes this book */}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  ); // Ends the markup
} // Ends the component

export default Books; // Shares this page with App.jsx