const request = require("supertest");
const express = require("express");
const multer = require("multer");  // Import multer as usual
const { uploadImages } = require("../../controllers/imageController");  // Your controller

// Mock multer and related modules
jest.mock("multer", () => {
  return {
    diskStorage: jest.fn().mockImplementation((config) => {
      return {
        _config: config,  // Optionally store config
      };
    }),
    array: jest.fn().mockImplementation((field, maxCount) => (req, res, cb) => {
      cb(null, [{ filename: "test.jpg" }]);  // Simulate file upload success
    }),
  };
});

jest.mock("fs", () => ({
  existsSync: jest.fn().mockReturnValue(false),  // Simulate no existing directory
  mkdirSync: jest.fn(),  // Prevent real directory creation
}));

jest.mock("path", () => ({
  join: jest.fn().mockReturnValue("../../uploads/h001/filename.jpg"),  // Mock path.join
}));

jest.mock("../../models/hotelModel", () => ({
  readHotelsFile: jest.fn(),
  writeHotelsFile: jest.fn(),
}));

// Express setup
const app = express();
app.use(express.json());
app.post("/upload", uploadImages);  // Image upload endpoint

describe("Image Controller - uploadImages", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a 500 if image upload fails", async () => {
    // Simulate an error in multer's upload by calling the callback with an error
    multer.mockImplementation(() => ({
      array: jest.fn((field, maxCount) => (req, res, cb) => {
        cb(new Error("Image upload failed"));
      })
    }));

    const response = await request(app)
      .post("/upload")
      .field("hotel_id", "h001")
      .attach("images", "test.jpg");  // Simulate file upload

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Image upload failed");
  });

  it("should return a 200 if images are uploaded successfully", async () => {
    const mockHotel = {
      hotel_id: "h001",
      images: [],
    };

    // Mock readHotelsFile to return a hotel
    require("../models/hotelModel").readHotelsFile.mockReturnValue([mockHotel]);

    // Mock writeHotelsFile to not do anything (since it's writing to a file)
    require("../models/hotelModel").writeHotelsFile.mockImplementation(() => {});

    // Simulate file upload
    const response = await request(app)
      .post("/upload")
      .field("hotel_id", "h001")
      .attach("images", "test.jpg");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Images uploaded successfully");
    expect(response.body.imageUrls).toBeDefined();
  });

  it("should return a 404 if hotel not found", async () => {
    // Mock readHotelsFile to return no hotels
    require("../models/hotelModel").readHotelsFile.mockReturnValue([]);

    const response = await request(app)
      .post("/upload")
      .field("hotel_id", "h001")
      .attach("images", "test.jpg");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Hotel not found");
  });

  it("should return a 500 if failed to update hotel record", async () => {
    const mockHotel = {
      hotel_id: "h001",
      images: [],
    };

    // Mock readHotelsFile to return a hotel
    require("../../models/hotelModel").readHotelsFile.mockReturnValue([mockHotel]);

    // Simulate an error during writeHotelsFile
    require("../../models/hotelModel").writeHotelsFile.mockImplementation(() => {
      throw new Error("Failed to update hotel record");
    });

    const response = await request(app)
      .post("/upload")
      .field("hotel_id", "h001")
      .attach("images", "test.jpg");

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Failed to update hotel record");
  });
});
