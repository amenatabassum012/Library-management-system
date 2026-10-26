import axios from "axios"; // Loads axios, the tool that sends requests to your server

const api = axios.create({ // Creates one axios setup that every page will reuse
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api", // Uses the online address when one is set. Otherwise uses your laptop's server
}); // Ends the setup

export default api; // Shares this setup with other files