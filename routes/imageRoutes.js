const express = require("express");
const router = express.Router();
const { uploadImages } = require("../controllers/imageController");

router.post("/images", uploadImages);

module.exports = router;
