const express = require("express");

const { addVideo, updateVideo, deleteVideo, addView, getByTag, getVideo, random, search, sub, trend } = require("../controllers/video.js");
const { verifyToken } = require("../verifyToken.js");

const router = express.Router();

//create a video
router.post("/", verifyToken, addVideo)
router.put("/:id", verifyToken, deleteVideo)
router.delete("/:id", verifyToken, addVideo)
router.get("/find/:id", getVideo)
router.put("/view/:id", addView)
router.get("/trend", trend)
router.get("/random", random)
router.get("/sub", verifyToken, sub)
router.get("/tags", getByTag)
router.get("/search", search)


module.exports = router;
