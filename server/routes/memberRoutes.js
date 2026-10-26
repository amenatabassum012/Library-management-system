const express = require("express"); // Loads Express so we can make a router
const router = express.Router(); // A router is a small group of related addresses
const { getMembers, addMember } = require("../controllers/memberController"); // Loads the two member functions

router.get("/", getMembers); // GET /api/members runs getMembers
router.post("/", addMember); // POST /api/members runs addMember

module.exports = router; // Shares the router with server.js