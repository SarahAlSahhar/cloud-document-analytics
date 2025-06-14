const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

const STORAGE_DIR = path.join(__dirname, '../uploads');

// Ensure storage directory exists
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

// Save file to local storage
const saveFile = async (file) => {
  try {
    const filename = `${uuidv4()}-${file.originalname}`;
    const filePath = path.join(STORAGE_DIR, filename);
    
    // Create a copy of the file in our storage directory
    fs.copyFileSync(file.path, filePath);
    
    // Remove the temporary file
    fs.unlinkSync(file.path);
    
    return {
      key: filename,
      url: `/api/files/${filename}`
    };
  } catch (error) {
    logger.error(`File save error: ${error.message}`);
    throw error;
  }
};

// Get file path
const getFilePath = (key) => {
  return path.join(STORAGE_DIR, key);
};

// Delete file
const deleteFile = async (key) => {
  try {
    const filePath = path.join(STORAGE_DIR, key);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    logger.error(`File delete error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  saveFile,
  getFilePath,
  deleteFile
};