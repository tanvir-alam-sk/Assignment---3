const request = require("supertest");
const express = require("express");
const multer = require("multer");
const { uploadImages } = require("../../controllers/imageController");
const { readHotelsFile, writeHotelsFile } = require("../../models/hotelModel");
const fs = require("fs");

jest.mock("../../models/hotelModel", () => ({
  readHotelsFile: jest.fn(),
  writeHotelsFile: jest.fn(),
}));

jest.mock("fs", () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
}));

// Correctly mock multer with diskStorage and array method
jest.mock("multer", () => {
  const multerMock = jest.fn(() => ({
    array: jest.fn().mockImplementation((field, maxCount) => (req, res, next) => next()),
  }));

  multerMock.diskStorage = jest.fn().mockReturnValue({
    destination: jest.fn(),
    filename: jest.fn(),
  });

  return multerMock;
});

describe("Image Controller - uploadImages", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.post("/upload/h001", uploadImages);
  });

  it("should upload images and return a 200 status", async () => {
    const mockHotel = {
      hotel_id: "h001",
      images: ["test.jpg"],
    };

    // Mocking readHotelsFile and writeHotelsFile
    readHotelsFile.mockResolvedValue([mockHotel]);
    writeHotelsFile.mockResolvedValue();

    const mockFiles = [
      {
        originalname: "test.jpg",
        filename: "test.jpg",
      },
    ];

    const res = await request(app)
      .post("/upload")
      .attach("images", Buffer.from("dummy image data"), "test.jpg")
      .field("hotel_id", "h001");

    // Check if file is uploaded successfully
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Images uploaded successfully");
    expect(res.body.imageUrls).toEqual([
      "/uploads/h001/test.jpg",
    ]);
    expect(writeHotelsFile).toHaveBeenCalled();
  });

  it("should return a 404 if hotel not found", async () => {
    readHotelsFile.mockResolvedValue([]);

    const res = await request(app)
      .post("/upload/h001")
      .attach("images", Buffer.from("dummy image data"), "test.jpg")
      .field("hotel_id", "h001");

    // Check if hotel was not found
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Hotel not found");
  });
  it("should return a 500 if image upload fails", async () => {
    const mockHotel = {
      body: { hotel_id: "h001" },
      files: [{ filename: "test.jpg" }],
    };

    // Simulate a multer error by rejecting the file upload
    jest.spyOn(fs, "mkdirSync").mockImplementation(() => {
      throw new Error("Error creating directory");
    });

    readHotelsFile.mockResolvedValue([mockHotel]);
    const res = await request(app)
      .post("/upload/h001")
      .attach("images", Buffer.from("dummy image data"), "test.jpg")
      .field("hotel_id", "h0011");

    // Check if internal server error is returned
    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Image upload failed");
  });
});

