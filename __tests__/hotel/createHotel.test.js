const { createHotel } = require("../../controllers/hotelController");
const { readHotelsFile, writeHotelsFile } = require("../../models/hotelModel");

jest.mock("../../models/hotelModel", () => ({
    readHotelsFile: jest.fn(),
    writeHotelsFile: jest.fn(),
  }));

  describe("Hotel Controller - createHotel", () => {
    it("should create a new hotel and return a 201 status", async () => {
      const newHotel = {
        hotel_id: "2",
        title: "New Hotel",
        images: ["https://example.com/image.jpg"],
        description: "A nice hotel",
        guest_count: 2,
        bedroom_count: 1,
        bathroom_count: 1,
        amenities: ["WiFi", "Parking"],
        host_information: { name: "John Doe", contact: "123456789" },
        address: "123 Hotel St",
        latitude: 40.7128,
        longitude: -74.0060,
      };
  
      // Mock readHotelsFile to return an empty array
      readHotelsFile.mockResolvedValue([]);
      // Correctly mock writeHotelsFile to resolve without errors
      writeHotelsFile.mockResolvedValue(); // Use `writeHotelsFile` not `writeHotelFile`
  
      const req = { body: newHotel };
      const res = { 
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      await createHotel(req, res);
  
      // Check if status and json were called with the correct values
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Hotel added successfully",
        hotel: {
          hotel_id: "2",
          slug: "New-Hotel", 
          title: "New Hotel",
          images: ["https://example.com/image.jpg"],
          description: "A nice hotel",
          guest_count: 2,
          bedroom_count: 1,
          bathroom_count: 1,
          address: "123 Hotel St",
          amenities: ["WiFi", "Parking"],
          host_information: {
            name: "John Doe",
            contact: "123456789"
          },
          latitude: 40.7128,
          longitude: -74.0060,
          rooms: [
            {
                hotel_slug: "New-Hotel", // Check for the actual hotel_slug value
                room_image: "https://example.com/hotel2/room2.jpg",
                bedroom_count: 1,
            }
          ],
        },
      });
    });
  });
  
  
