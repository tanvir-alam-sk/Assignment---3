const express = require("express");
const router = express.Router();

const {
    getHotelByNameAndId
  } = require("../controllers/hotelController");

router.get("/:name/:id", getHotelByNameAndId);

module.exports = router;