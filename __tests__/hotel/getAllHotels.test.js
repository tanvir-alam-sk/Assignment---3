const { getAllHotels } = require("../../controllers/hotelController");
const { readHotelsFile } = require("../../models/hotelModel");

jest.mock("../../models/hotelModel", () => ({
  readHotelsFile: jest.fn(),
}));

describe("Hotel Controller - getAllHotels", () => {
  it("should return a list of hotels with a 201 status", async () => {
    const mockHotelsData = [
      {
        hotel_id: "1",
        title: "Hotel California",
        guest_count: 2,
        bedroom_count: 1,
        bathroom_count: 1,
        amenities: ["WiFi", "Parking"],
      },
    ];
    readHotelsFile.mockResolvedValue(mockHotelsData);

    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await getAllHotels(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Find all Hotels successfully",
      hotel: mockHotelsData,
    });
  });
});
