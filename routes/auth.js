const express = require("express");
const { googleAuth, signin, signup } = require("../controllers/auth.js");


const router = express.Router();

//CREATE A USER
router.post("/signup", signup)

//SIGN IN
router.post("/signin", signin)

//GOOGLE AUTH
router.post("/google", googleAuth)

module.exports = router;
