const express = require("express");
const router = express.Router();
const {
  getAllHotels,
  createHotel,
  getHotelById,
  updateHotel,
} = require("../controllers/hotelController");

router.get("/hotel", getAllHotels);
router.post("/hotel", createHotel);
router.get("/hotel/:id", getHotelById);
router.put("/hotel/:id", updateHotel);

module.exports = router;
