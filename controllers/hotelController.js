const { readHotelsFile, writeHotelsFile } = require("../models/hotelModel");
const slugify = require("slugify");

async function getAllHotels(req, res) {
  try {
    const hotels = await readHotelsFile();
    return res
      .status(201)
      .json({ message: "Find all Hotels successfully", hotel: hotels });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching hotels", error });
  }
}

async function createHotel(req, res) {
  const newHotelData = req.body;

  const {
    hotel_id,
    title,
    images,
    description,
    guest_count,
    bedroom_count,
    bathroom_count,
    amenities,
    host_information,
    address,
    latitude,
    longitude,
  } = newHotelData;

  if (
    !hotel_id ||
    !title ||
    !images ||
    !description ||
    !guest_count ||
    !bedroom_count ||
    !bathroom_count ||
    !amenities ||
    !host_information ||
    !address ||
    !latitude ||
    !longitude
  ) {
    return res.status(400).json({
      message:
        "Required fields: hotel_id, title, images, description, guest_count, " +
        "bedroom_count, bathroom_count, amenities, host_information, address, " +
        "latitude, longitude",
    });
  }

  const newHotel = {
    hotel_id,
    slug: slugify(title),
    title,
    images,
    description,
    guest_count,
    bedroom_count,
    bathroom_count,
    amenities,
    host_information,
    address,
    latitude,
    longitude,
    rooms: [
      {
        hotel_slug: slugify(title),
        room_image: "https://example.com/hotel2/room2.jpg",
        bedroom_count,
      },
    ],
  };

  try {
    const hotelsData = await readHotelsFile();
    if (hotelsData.some((hotel) => hotel.hotel_id === hotel_id)) {
      return res
        .status(400)
        .json({ message: "Hotel with this ID already exists" });
    }

    hotelsData.push(newHotel);
    await writeHotelsFile(hotelsData);

    return res
      .status(201)
      .json({ message: "Hotel added successfully", hotel: newHotel });
  } catch (error) {
    return res.status(500).json({ message: "Error adding hotel", error });
  }
}

async function getHotelById(req, res) {
  try {
    const hotels = await readHotelsFile();
    const hotel = hotels.find((hotel) => hotel.hotel_id == req.params.id);
    if (hotel) {
      return res
        .status(200)
        .json({ message: "Find this Hotel successfully", hotel });
    } else {
      return res.status(404).json({ message: "Could not find this hotel" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching hotel", error });
  }
}

async function updateHotel(req, res) {
  const hotelUpdateData = req.body;

  try {
    let hotels = await readHotelsFile();
    const hotelIndex = hotels.findIndex(
      (hotel) => hotel.hotel_id == req.params.id
    );

    if (hotelIndex === -1) {
      return res.status(404).json({ message: "This Hotel doesn't exist" });
    }

    Object.assign(hotels[hotelIndex], hotelUpdateData);
    await writeHotelsFile(hotels);

    return res
      .status(200)
      .json({
        message: "Hotel updated successfully",
        hotel: hotels[hotelIndex],
      });
  } catch (error) {
    return res.status(500).json({ message: "Error updating hotel", error });
  }
}

async function getHotelByNameAndId(req, res) {
  try {
    const hotels = await readHotelsFile();
    const hotel = hotels.find((hotel) => hotel.hotel_id == req.params.id  &&  hotel.slug==req.params.name);
    if (hotel) {
      return res
        .status(200)
        .json({ message: "Find this Hotel successfully", hotel });
    } else {
      return res.status(404).json({ message: "Could not find this hotel" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching hotel", error });
  }
}

module.exports = {
  getAllHotels,
  createHotel,
  getHotelById,
  updateHotel,
  getHotelByNameAndId,
};
