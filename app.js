const express = require("express");
const cors=require("cors")
const path = require("path");

const app = express();
const hotelRoutes = require("./routes/hotelRoutes");
const imageRoutes = require("./routes/imageRoutes");
const hotelDetailsRoutes = require("./routes/hotelDetailsRoute");

app.use(cors())
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/hotel", hotelRoutes);
app.use("/hotel-details", hotelDetailsRoutes);
app.use("/images", imageRoutes);
app.use("/*", imageRoutes);

module.exports = app;
