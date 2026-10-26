import { useState, useEffect } from "react"; // Loads useState to remember data and useEffect to run code at a set time
import api from "../services/api"; // Loads the axios setup that talks to your server

const emptyForm = { name: "", email: "", phone: "" }; // The form in its empty state. We reuse it to clear the form

function Members() { // The Members page component
  const [members, setMembers] = useState([]); // The list of members we remember
  const [error, setError] = useState(""); // A message shown if loading fails
  const [form, setForm] = useState(emptyForm); // The values currently typed in the form boxes
  const [editingId, setEditingId] = useState(null); // The id of the member being edited. null means we are adding
  const [message, setMessage] = useState(""); // The success or error message under the form
  const [messageColor, setMessageColor] = useState("green"); // The colour of that message

  const loadMembers = async () => { // Gets the members from your server
    try { // Try to run the code below
      const response = await api.get("/members"); // Sends a GET request to /api/members
      setMembers(response.data); // Saves the list. React redraws the table
      setError(""); // Clears any old error
    } catch (err) { // Runs if something goes wrong
      setError("Could not load members. Is the server running?"); // Saves a message to show
    } // Ends the catch block
  }; // Ends the function

  useEffect(() => { // Runs the code inside at a set time
    loadMembers(); // Loads the members
  }, []); // Empty brackets mean: run only once, when the page opens

  const handleChange = (e) => { // Runs every time someone types in a form box
    setForm({ ...form, [e.target.name]: e.target.value }); // Copies the form, then changes only the box that was typed in
  }; // Ends the function

  const resetForm = () => { // Puts the form back to its "add a member" state
    setForm(emptyForm); // Clears all the boxes
    setEditingId(null); // Forgets the member we were editing
  }; // Ends the function

  const startEdit = (member) => { // Fills the form with a member's details
    setForm({ // Sets every box at once
      name: member.name, // The name
      email: member.email, // The email
      phone: member.phone, // The phone number
    }); // Ends the form values
    setEditingId(member._id); // Remembers which member we are editing
    setMessage(""); // Clears any old message
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scrolls up to the form
  }; // Ends the function

  const handleSubmit = async (e) => { // Runs when the form is submitted
    e.preventDefault(); // Stops the browser from reloading the page
    try { // Try to run the code below
      if (editingId) { // Checks if we are editing
        await api.put(`/members/${editingId}`, form); // Sends a PUT request to update the member
        setMessage("Member updated successfully"); // Saves the success message
      } else { // Otherwise we are adding
        await api.post("/members", form); // Sends a POST request to create the member
        setMessage("Member added successfully"); // Saves the success message
      } // Ends the check
      setMessageColor("green"); // Makes the message green
      resetForm(); // Clears the form
      loadMembers(); // Reloads the table so the change appears
    } catch (err) { // Runs if the server rejects the data or is off
      setMessage(err.response?.data?.message || "Could not reach the server"); // Shows the server's reason, like "Phone must be 10 digits"
      setMessageColor("red"); // Makes the message red
    } // Ends the catch block
  }; // Ends the function

  const handleDelete = async (id) => { // Deletes one member. It receives the member's id
    if (!window.confirm("Delete this member?")) { // Asks the user to confirm
      return; // Stops here if they cancel
    } // Ends the check
    try { // Try to run the code below
      await api.delete(`/members/${id}`); // Sends a DELETE request to your server
      if (editingId === id) { // Checks if we were editing the member who was just deleted
        resetForm(); // Clears the form, so it does not hold a deleted member
      } // Ends the check
      setMessage("Member deleted"); // Saves the success message
      setMessageColor("green"); // Makes the message green
      loadMembers(); // Reloads the table so the member disappears
    } catch (err) { // Runs if the server refuses, like when the member still has issued books
      setMessage(err.response?.data?.message || "Could not delete the member"); // Shows the server's reason
      setMessageColor("red"); // Makes the message red
    } // Ends the catch block
  }; // Ends the function

  return ( // Returns the markup for this page
    <div>
      {/* One wrapper element */}
      <h2>{editingId ? "Edit Member" : "Add a Member"}</h2>
      {/* The heading changes depending on whether we are editing */}
      <form onSubmit={handleSubmit}>
        {/* The form. handleSubmit runs when it is submitted */}
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        {/* Name box. value shows the remembered text. onChange updates it as you type */}
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        {/* Email box. The browser checks the email shape */}
        <input name="phone" placeholder="Phone (10 digits)" value={form.phone} onChange={handleChange} required />
        {/* Phone box */}
        <button type="submit">{editingId ? "Update Member" : "Add Member"}</button>
        {/* The button text changes while editing */}
        {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
        {/* The Cancel button only appears while editing */}
      </form>
      <p style={{ color: messageColor, minHeight: "20px" }}>{message}</p>
      {/* The success or error message under the form */}

      <h2>Members List</h2>
      {/* The table title */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* Shows the loading error, only if there is one */}
      <table>
        {/* The members table */}
        <thead>
          {/* The header row */}
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Member Since</th>
            <th>Action</th>
            {/* The five column headings */}
          </tr>
        </thead>
        <tbody>
          {/* The table body, filled from the members list */}
          {members.length === 0 ? ( // Checks if the list is empty
            <tr>
              <td colSpan="5">No members found</td>
              {/* One cell as wide as all five columns */}
            </tr>
          ) : ( // Otherwise show the members
            members.map((member) => ( // Returns one row for every member
              <tr key={member._id}>
                {/* One row. key is the member's id, so React can track it */}
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{member.phone}</td>
                {/* The name, email and phone for this member */}
                <td>{new Date(member.membershipDate).toLocaleDateString()}</td>
                {/* Turns the stored date into a readable date */}
                <td>
                  {/* The action cell */}
                  <button onClick={() => startEdit(member)}>Edit</button>
                  {/* Fills the form with this member */}
                  <button onClick={() => handleDelete(member._id)}>Delete</button>
                  {/* Deletes this member */}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  ); // Ends the markup
} // Ends the component

export default Members; // Shares this page with App.jsx