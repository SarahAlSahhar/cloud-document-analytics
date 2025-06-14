// const { ObjectId } = require('mongodb');
// const { getCollections } = require('../config/db');
// const { extractTextFromDocument, findSearchMatches } = require('../services/documentProcessingService');
// const { saveFile, getFilePath, deleteFile } = require('../services/storageService');
// const logger = require('../utils/logger');

// // Upload a document
// exports.uploadDocument = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }
    
//     const file = req.file;
//     const fileType = file.originalname.split('.').pop()?.toLowerCase();
    
//     if (!['pdf', 'docx', 'doc'].includes(fileType)) {
//       return res.status(400).json({ message: 'Invalid file type. Only PDF, DOCX, and DOC are supported.' });
//     }
    
//     // Extract text from the document
//     const content = await extractTextFromDocument(file.path, fileType);
    
//     // Save file to storage
//     const fileData = await saveFile(file);
    
//     // Get title from filename (remove extension and replace underscores with spaces)
//     // const title = file.originalname.split('.')[0].replace(/_/g, ' ');
//     const { extractTitleFromContent } = require('../services/documentProcessingService');
// const title = extractTitleFromContent(content, file.originalname);
    
//     const { documentsCollection } = await getCollections();
    
//     // Create document record in database
//     const document = {
//       title,
//       filename: file.originalname,
//       fileType,
//       fileSize: file.size,
//       uploadDate: new Date(),
//       url: fileData.url,
//       key: fileData.key,
//       content,
//       classification: 'Unclassified'
//     };
    
//     const result = await documentsCollection.insertOne(document);
    
//     res.status(201).json({
//       success: true,
//       message: 'File uploaded successfully',
//       document: {
//         id: result.insertedId,
//         title: document.title,
//         filename: document.filename,
//         fileType: document.fileType,
//         fileSize: document.fileSize,
//         uploadDate: document.uploadDate,
//         url: document.url,
//         classification: document.classification
//       }
//     });
//   } catch (error) {
//     logger.error(`Upload Error: ${error.message}`);
//     res.status(500).json({ message: 'Server error during upload', error: error.message });
//   }
// };

// // Get all documents
// exports.getAllDocuments = async (req, res) => {
//   try {
//     const { documentsCollection } = await getCollections();
    
//     const documents = await documentsCollection.find({})
//       .project({ content: 0, key: 0 })
//       .toArray();
    
//     res.status(200).json(documents.map(doc => ({
//       id: doc._id,
//       title: doc.title,
//       filename: doc.filename,
//       fileType: doc.fileType,
//       fileSize: doc.fileSize,
//       uploadDate: doc.uploadDate,
//       url: doc.url,
//       classification: doc.classification
//     })));
//   } catch (error) {
//     logger.error(`Get All Documents Error: ${error.message}`);
//     res.status(500).json({ message: 'Server error fetching documents' });
//   }
// };

// // Sort documents
// exports.sortDocuments = async (req, res) => {
//   try {
//     const { sortBy = 'title', order = 'asc' } = req.query;
    
//     // Validate sort parameters
//     const validSortFields = ['title', 'filename', 'fileType', 'fileSize', 'uploadDate', 'classification'];
//     if (!validSortFields.includes(sortBy)) {
//       return res.status(400).json({ message: `Invalid sort field. Valid options are: ${validSortFields.join(', ')}` });
//     }
    
//     if (!['asc', 'desc'].includes(order)) {
//       return res.status(400).json({ message: 'Invalid sort order. Use "asc" or "desc".' });
//     }
    
//     // Build sort object
//     const sortObj = {};
//     sortObj[sortBy] = order === 'asc' ? 1 : -1;
    
//     const { documentsCollection } = await getCollections();
    
//     const documents = await documentsCollection.find({})
//       .project({ content: 0, key: 0 })
//       .sort(sortObj)
//       .toArray();
    
//     res.status(200).json(documents.map(doc => ({
//       id: doc._id,
//       title: doc.title,
//       filename: doc.filename,
//       fileType: doc.fileType,
//       fileSize: doc.fileSize,
//       uploadDate: doc.uploadDate,
//       url: doc.url,
//       classification: doc.classification
//     })));
//   } catch (error) {
//     logger.error(`Sort Documents Error: ${error.message}`);
//     res.status(500).json({ message: 'Server error sorting documents' });
//   }
// };

// // Search documents
// exports.searchDocuments = async (req, res) => {
//   try {
//     const { query } = req.query;
    
//     if (!query || typeof query !== 'string') {
//       return res.status(400).json({ message: 'Search query is required' });
//     }
    
//     const { documentsCollection } = await getCollections();
    
//     // Perform text search
//     const documents = await documentsCollection.find(
//       { $text: { $search: query } },
//       { score: { $meta: "textScore" } }
//     )
//     .sort({ score: { $meta: "textScore" } })
//     .project({ _id: 1, title: 1, filename: 1, content: 1 })
//     .toArray();
    
//     // Process search results to include match highlights
//     const searchResults = documents.map(doc => {
//       const matches = findSearchMatches(doc.content || '', query);
      
//       return {
//         documentId: doc._id,
//         title: doc.title,
//         filename: doc.filename,
//         matches
//       };
//     });
    
//     res.status(200).json(searchResults);
//   } catch (error) {
//     logger.error(`Search Documents Error: ${error.message}`);
//     res.status(500).json({ message: 'Server error searching documents' });
//   }
// };

// // Get document by ID
// exports.getDocumentById = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     if (!ObjectId.isValid(id)) {
//       return res.status(400).json({ message: 'Invalid document ID' });
//     }
    
//     const { documentsCollection } = await getCollections();
    
//     const document = await documentsCollection.findOne(
//       { _id: new ObjectId(id) },
//       { projection: { content: 0, key: 0 } }
//     );
    
//     if (!document) {
//       return res.status(404).json({ message: 'Document not found' });
//     }
    
//     res.status(200).json({
//       id: document._id,
//       title: document.title,
//       filename: document.filename,
//       fileType: document.fileType,
//       fileSize: document.fileSize,
//       uploadDate: document.uploadDate,
//       url: document.url,
//       classification: document.classification
//     });
//   } catch (error) {
//     logger.error(`Get Document Error: ${error.message}`);
//     res.status(500).json({ message: 'Server error fetching document' });
//   }
// };

// // Delete document
// exports.deleteDocument = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     if (!ObjectId.isValid(id)) {
//       return res.status(400).json({ message: 'Invalid document ID' });
//     }
    
//     const { documentsCollection } = await getCollections();
    
//     const document = await documentsCollection.findOne(
//       { _id: new ObjectId(id) },
//       { projection: { key: 1 } }
//     );
    
//     if (!document) {
//       return res.status(404).json({ message: 'Document not found' });
//     }
    
//     // Delete from storage
//     await deleteFile(document.key);
    
//     // Delete from database
//     await documentsCollection.deleteOne({ _id: new ObjectId(id) });
    
//     res.status(200).json({ success: true, message: 'Document deleted successfully' });
//   } catch (error) {
//     logger.error(`Delete Document Error: ${error.message}`);
//     res.status(500).json({ message: 'Server error deleting document' });
//   }
// };

// // Download document
// exports.downloadDocument = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     if (!ObjectId.isValid(id)) {
//       return res.status(400).json({ message: 'Invalid document ID' });
//     }
    
//     const { documentsCollection } = await getCollections();
    
//     const document = await documentsCollection.findOne(
//       { _id: new ObjectId(id) },
//       { projection: { key: 1 } }
//     );
    
//     if (!document) {
//       return res.status(404).json({ message: 'Document not found' });
//     }
    
//     const filePath = getFilePath(document.key);
//     res.download(filePath, document.filename);
//   } catch (error) {
//     logger.error(`Download Document Error: ${error.message}`);
//     res.status(500).json({ message: 'Server error downloading document' });
//   }
// };


// controllers/documentController.js - Fixed for File Storage
const { fileStorage } = require('../config/fileStorage');
const { extractTextFromDocument, findSearchMatches, extractTitleFromContent } = require('../services/documentProcessingService');
const { saveFile, getFilePath, deleteFile } = require('../services/storageService');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

// Upload a document
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const file = req.file;
    const fileType = file.originalname.split('.').pop()?.toLowerCase();
    
    if (!['pdf', 'docx', 'doc'].includes(fileType)) {
      return res.status(400).json({ message: 'Invalid file type. Only PDF, DOCX, and DOC are supported.' });
    }
    
    try {
      // Extract text from the document
      const content = await extractTextFromDocument(file.path, fileType);
      
      // Extract title from content
      const title = extractTitleFromContent(content, file.originalname);
      
      // Save file to storage
      const fileData = await saveFile(file);
      
      // Create document record
      const document = {
        title,
        filename: file.originalname,
        fileType,
        fileSize: file.size,
        uploadDate: new Date(),
        url: fileData.url,
        key: fileData.key,
        content,
        classification: 'Unclassified'
      };
      
      const result = await fileStorage.insertDocument(document);
      
      res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        document: {
          id: result.insertedId,
          title: document.title,
          filename: document.filename,
          fileType: document.fileType,
          fileSize: document.fileSize,
          uploadDate: document.uploadDate,
          url: document.url,
          classification: document.classification
        }
      });
    } catch (extractError) {
      // If text extraction fails, still save the document with basic info
      logger.warn(`Text extraction failed for ${file.originalname}: ${extractError.message}`);
      
      const fileData = await saveFile(file);
      const title = file.originalname.split('.')[0].replace(/_/g, ' ').replace(/-/g, ' ');
      
      const document = {
        title,
        filename: file.originalname,
        fileType,
        fileSize: file.size,
        uploadDate: new Date(),
        url: fileData.url,
        key: fileData.key,
        content: `Text extraction failed for this ${fileType} file.`,
        classification: 'Unclassified'
      };
      
      const result = await fileStorage.insertDocument(document);
      
      res.status(201).json({
        success: true,
        message: 'File uploaded successfully (text extraction failed)',
        document: {
          id: result.insertedId,
          title: document.title,
          filename: document.filename,
          fileType: document.fileType,
          fileSize: document.fileSize,
          uploadDate: document.uploadDate,
          url: document.url,
          classification: document.classification
        }
      });
    }
  } catch (error) {
    logger.error(`Upload Error: ${error.message}`);
    res.status(500).json({ message: 'Server error during upload', error: error.message });
  }
};

// Get all documents
exports.getAllDocuments = async (req, res) => {
  try {
    const documents = await fileStorage.findDocuments();
    
    res.status(200).json(documents.map(doc => ({
      id: doc._id,
      title: doc.title,
      filename: doc.filename,
      fileType: doc.fileType,
      fileSize: doc.fileSize,
      uploadDate: doc.uploadDate,
      url: doc.url,
      classification: doc.classification
    })));
  } catch (error) {
    logger.error(`Get All Documents Error: ${error.message}`);
    res.status(500).json({ message: 'Server error fetching documents' });
  }
};

// Sort documents
exports.sortDocuments = async (req, res) => {
  try {
    const { sortBy = 'title', order = 'asc' } = req.query;
    
    // Validate sort parameters
    const validSortFields = ['title', 'filename', 'fileType', 'fileSize', 'uploadDate', 'classification'];
    if (!validSortFields.includes(sortBy)) {
      return res.status(400).json({ message: `Invalid sort field. Valid options are: ${validSortFields.join(', ')}` });
    }
    
    if (!['asc', 'desc'].includes(order)) {
      return res.status(400).json({ message: 'Invalid sort order. Use "asc" or "desc".' });
    }
    
    const documents = await fileStorage.findDocuments();
    
    // Sort documents
    const sortedDocuments = documents.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      // Handle different data types
      if (sortBy === 'fileSize') {
        aVal = parseInt(aVal) || 0;
        bVal = parseInt(bVal) || 0;
      } else if (sortBy === 'uploadDate') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else {
        aVal = (aVal || '').toString().toLowerCase();
        bVal = (bVal || '').toString().toLowerCase();
      }
      
      if (order === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });
    
    res.status(200).json(sortedDocuments.map(doc => ({
      id: doc._id,
      title: doc.title,
      filename: doc.filename,
      fileType: doc.fileType,
      fileSize: doc.fileSize,
      uploadDate: doc.uploadDate,
      url: doc.url,
      classification: doc.classification
    })));
  } catch (error) {
    logger.error(`Sort Documents Error: ${error.message}`);
    res.status(500).json({ message: 'Server error sorting documents' });
  }
};

// Search documents
exports.searchDocuments = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const documents = await fileStorage.searchDocuments(query);
    
    // Process search results to include match highlights
    const searchResults = documents.map(doc => {
      const matches = findSearchMatches(doc.content || '', query);
      
      return {
        documentId: doc._id,
        title: doc.title,
        filename: doc.filename,
        classification: doc.classification,
        matches
      };
    });
    
    res.status(200).json(searchResults);
  } catch (error) {
    logger.error(`Search Documents Error: ${error.message}`);
    res.status(500).json({ message: 'Server error searching documents' });
  }
};

// Get document by ID
exports.getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const document = await fileStorage.findDocumentById(id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    res.status(200).json({
      id: document._id,
      title: document.title,
      filename: document.filename,
      fileType: document.fileType,
      fileSize: document.fileSize,
      uploadDate: document.uploadDate,
      url: document.url,
      classification: document.classification
    });
  } catch (error) {
    logger.error(`Get Document Error: ${error.message}`);
    res.status(500).json({ message: 'Server error fetching document' });
  }
};

// Delete document
exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    
    const document = await fileStorage.findDocumentById(id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // Delete physical file if it exists
    if (document.key) {
      try {
        await deleteFile(document.key);
      } catch (fileError) {
        logger.warn(`Failed to delete physical file: ${fileError.message}`);
      }
    }
    
    // Delete from file storage
    await fileStorage.deleteDocument(id);
    
    res.status(200).json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    logger.error(`Delete Document Error: ${error.message}`);
    res.status(500).json({ message: 'Server error deleting document' });
  }
};

// Download document
exports.downloadDocument = async (req, res) => {
  try {
    const { id } = req.params;
    
    const document = await fileStorage.findDocumentById(id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    const filePath = getFilePath(document.key);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }
    
    res.download(filePath, document.filename);
  } catch (error) {
    logger.error(`Download Document Error: ${error.message}`);
    res.status(500).json({ message: 'Server error downloading document' });
  }
};