const { updateHotel } = require("../../controllers/hotelController");
const { readHotelsFile, writeHotelsFile } = require("../../models/hotelModel");

jest.mock("../../models/hotelModel", () => ({
  readHotelsFile: jest.fn(),
  writeHotelsFile: jest.fn(),
}));

describe("Hotel Controller - updateHotel", () => {
  it("should update an existing hotel and return a 200 status", async () => {
    const updatedHotelData = {
      hotel_id: "1",
      title: "Updated Hotel California",
      guest_count: 2,
      bedroom_count: 1,
      bathroom_count: 1,
      amenities: ["WiFi", "Parking", "Breakfast"],
    };
    readHotelsFile.mockResolvedValue([updatedHotelData]);
    writeHotelsFile.mockResolvedValue();

    const req = { params: { id: "1" }, body: updatedHotelData };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await updateHotel(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Hotel updated successfully",
      hotel: updatedHotelData,
    });
  });
});
