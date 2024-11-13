const { getHotelById } = require("../../controllers/hotelController");
const { readHotelsFile } = require("../../models/hotelModel");

// Mock the readHotelsFile function
jest.mock("../../models/hotelModel", () => ({
  readHotelsFile: jest.fn(),
}));

describe("Hotel Controller - getHotelById", () => {
  it("should return a hotel with the specified ID and a 200 status", async () => {
    const mockHotel = {
      hotel_id: "h001"
    };

    // Mock readHotelsFile to return the mock hotel data
    readHotelsFile.mockResolvedValue([mockHotel]);

    const req = { params: { id: "h001" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getHotelById(req, res);

    // Check if status and json were called with the correct values
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Find this Hotel successfully", // Update to match the actual controller message
      hotel: mockHotel,
    });
  });
});
