const request = require('supertest');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { uploadImages } = require('../../controllers/imageController');

// Mock the hotel model functions
jest.mock('../../models/hotelModel', () => ({
  readHotelsFile: jest.fn(),
  writeHotelsFile: jest.fn()
}));

// Mock fs functions
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn(),
  mkdirSync: jest.fn()
}));

const app = express();
app.post('/upload', uploadImages);

describe('Upload Images Controller', () => {
  const mockHotel = {
    hotel_id: "h001",
    images: []
  };
  
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Set up default mock implementations
    fs.existsSync.mockReturnValue(false);
    fs.mkdirSync.mockImplementation(() => undefined);
    require('../../models/hotelModel').readHotelsFile.mockReturnValue([mockHotel]);
  });

  afterEach(() => {
    // Clean up any test files that were created
    const testUploadDir = path.join(__dirname, '../uploads/123');
    if (fs.existsSync(testUploadDir)) {
      fs.rmdirSync(testUploadDir, { recursive: true });
    }
  });

  test('should successfully upload images', async () => {
    const response = await request(app)
      .post('/upload')
      .field('hotel_id', "h001")
      .attach('images', Buffer.from('fake-image'), {
        filename: 'test-image.jpg',
        contentType: 'image/jpeg'
      })
      .attach('images', Buffer.from('fake-image-2'), {
        filename: 'test-image-2.jpg',
        contentType: 'image/jpeg'
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Images uploaded successfully');
    expect(response.body.imageUrls).toHaveLength(2);
    
    // Verify hotel record was updated
    const writeHotelsFile = require('../../models/hotelModel').writeHotelsFile;
    expect(writeHotelsFile).toHaveBeenCalledTimes(1);
    expect(writeHotelsFile.mock.calls[0][0][0].images).toHaveLength(2);
  });

  test('should fail if hotel_id is not found', async () => {
    require('../../models/hotelModel').readHotelsFile.mockReturnValue([]);

    const response = await request(app)
      .post('/upload')
      .field('hotel_id', 'h001')
      .attach('images', Buffer.from('fake-image'), {
        filename: 'test-image.jpg',
        contentType: 'image/jpeg'
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Hotel not found');
  });

  test('should fail if file size exceeds limit', async () => {
    // Create a buffer larger than 5MB
    const largeBuffer = Buffer.alloc(6 * 1024 * 1024);

    const response = await request(app)
      .post('/upload')
      .field('hotel_id', "h001")
      .attach('images', largeBuffer, {
        filename: 'large-image.jpg',
        contentType: 'image/jpeg'
      });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Image upload failed');
  });

  test('should fail if more than 10 images are uploaded', async () => {
    const attachments = Array(11).fill(null).map((_, index) => ({
      buffer: Buffer.from('fake-image'),
      filename: `test-image-${index}.jpg`,
      contentType: 'image/jpeg'
    }));

    const req = request(app).post('/upload').field('hotel_id', "h001");
    
    attachments.forEach(attachment => {
      req.attach('images', attachment.buffer, {
        filename: attachment.filename,
        contentType: attachment.contentType
      });
    });

    const response = await req;

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Image upload failed');
  });

  test('should create upload directory if it does not exist', async () => {
    await request(app)
      .post('/upload')
      .field('hotel_id', "h001")
      .attach('images', Buffer.from('fake-image'), {
        filename: 'test-image.jpg',
        contentType: 'image/jpeg'
      });

    expect(fs.existsSync).toHaveBeenCalledWith(expect.stringContaining('/uploads/h001'));
    expect(fs.mkdirSync).toHaveBeenCalledWith(
      expect.stringContaining('/uploads/h001'),
      { recursive: true }
    );
  });

  test('should handle model write errors', async () => {
    require('../../models/hotelModel').writeHotelsFile.mockImplementation(() => {
      throw new Error('Write failed');
    });

    const response = await request(app)
      .post('/upload')
      .field('hotel_id', "h001")
      .attach('images', Buffer.from('fake-image'), {
        filename: 'test-image.jpg',
        contentType: 'image/jpeg'
      });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Failed to update hotel record');
  });
});