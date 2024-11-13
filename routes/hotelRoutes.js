const express = require("express");
const router = express.Router();
const {
  getAllHotels,
  createHotel,
  getHotelById,
  updateHotel,
} = require("../controllers/hotelController");

router.get("/", getAllHotels);
router.post("/", createHotel);
router.get("/:id", getHotelById);
router.put("/:id", updateHotel);

module.exports = router;
