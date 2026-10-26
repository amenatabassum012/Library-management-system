import axios from "axios"; // Loads axios, the tool that sends requests to your server

const api = axios.create({ // Creates one axios setup that every page will reuse
  baseURL: "http://localhost:5000/api", // The start of every address, so pages only write /books, /members and so on
}); // Ends the setup

export default api; // Shares this setup with other files