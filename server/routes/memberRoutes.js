const express = require("express"); // Loads Express so we can make a router
const router = express.Router(); // A router is a small group of related addresses
const { getMembers, addMember, updateMember, deleteMember } = require("../controllers/memberController"); // Loads the four member functions

router.get("/", getMembers); // GET /api/members runs getMembers
router.post("/", addMember); // POST /api/members runs addMember
router.put("/:id", updateMember); // PUT /api/members/123 runs updateMember. :id is the member's id
router.delete("/:id", deleteMember); // DELETE /api/members/123 runs deleteMember

module.exports = router; // Shares the router with server.js