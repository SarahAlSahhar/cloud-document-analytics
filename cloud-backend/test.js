// const express = require('express');
// const cors = require('cors');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// require('dotenv').config();

// console.log('🚀 Starting server with File Storage...');

// const app = express();

// // Basic middleware
// app.use(cors());
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: true }));

// // Serve static files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Configure multer for file uploads
// const upload = multer({
//   dest: 'uploads/temp/',
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10MB
//   },
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = ['.pdf', '.docx', '.doc'];
//     const fileExt = path.extname(file.originalname).toLowerCase();
    
//     if (allowedTypes.includes(fileExt)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only PDF, DOCX, and DOC files are allowed'), false);
//     }
//   }
// });

// // Ensure directories exist
// const uploadsDir = path.join(__dirname, 'uploads');
// const tempDir = path.join(__dirname, 'uploads', 'temp');
// [uploadsDir, tempDir].forEach(dir => {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// });

// // Home route
// app.get('/', (req, res) => {
//   res.json({
//     message: 'Cloud Document Analytics API - Technology Focus',
//     status: 'Server is running with File Storage!',
//     storageMode: 'File Storage (Local)',
//     timestamp: new Date().toISOString(),
//     endpoints: {
//       upload: 'POST /upload-document',
//       documents: 'GET /documents',
//       search: 'GET /search?query=your-search',
//       classifications: 'GET /classifications',
//       statistics: 'GET /statistics',
//       health: 'GET /health'
//     }
//   });
// });

// app.get('/health', (req, res) => {
//   res.json({ 
//     status: 'OK',
//     storageMode: 'File Storage',
//     timestamp: new Date().toISOString()
//   });
// });

// // Initialize classifications
// app.get('/init-classifications', async (req, res) => {
//   try {
//     // Simple tech classifications for file storage
//     const classifications = [
//       { id: 'web-dev', name: 'Web Development', keywords: ['html', 'css', 'javascript', 'react', 'vue', 'angular', 'node.js'] },
//       { id: 'mobile-dev', name: 'Mobile Development', keywords: ['android', 'ios', 'mobile', 'flutter', 'react native'] },
//       { id: 'data-science', name: 'Data Science', keywords: ['python', 'pandas', 'numpy', 'data analysis', 'machine learning'] },
//       { id: 'ai-ml', name: 'AI & Machine Learning', keywords: ['artificial intelligence', 'neural network', 'tensorflow', 'pytorch'] },
//       { id: 'cloud', name: 'Cloud Computing', keywords: ['aws', 'azure', 'google cloud', 'kubernetes', 'docker'] },
//       { id: 'database', name: 'Database', keywords: ['sql', 'mongodb', 'postgresql', 'mysql', 'database'] },
//       { id: 'cybersecurity', name: 'Cybersecurity', keywords: ['security', 'encryption', 'firewall', 'vulnerability'] }
//     ];
    
//     const { fileStorage } = require('./config/fileStorage');
//     await fileStorage.insertClassifications(classifications);
    
//     res.json({
//       success: true,
//       message: 'Technology classifications initialized!',
//       totalCategories: classifications.length,
//       categories: classifications.map(c => c.name)
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Failed to initialize classifications',
//       error: error.message
//     });
//   }
// });

// // Upload document
// app.post('/upload-document', upload.single('document'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: 'No file uploaded'
//       });
//     }

//     const file = req.file;
//     const fileType = path.extname(file.originalname).toLowerCase().substring(1);
    
//     console.log(`📄 Processing: ${file.originalname}`);
    
//     // For demo purposes, create some sample content and classification
//     const sampleContent = `Sample content for ${file.originalname}. This document contains technology-related information.`;
    
//     // Simple classification based on filename
//     let classification = 'Unclassified';
//     const filename = file.originalname.toLowerCase();
//     if (filename.includes('web') || filename.includes('html') || filename.includes('css') || filename.includes('javascript')) {
//       classification = 'Web Development';
//     } else if (filename.includes('mobile') || filename.includes('android') || filename.includes('ios')) {
//       classification = 'Mobile Development';
//     } else if (filename.includes('data') || filename.includes('python') || filename.includes('analysis')) {
//       classification = 'Data Science';
//     } else if (filename.includes('cloud') || filename.includes('aws') || filename.includes('docker')) {
//       classification = 'Cloud Computing';
//     }
    
//     // Move file to permanent location
//     const permanentPath = path.join(__dirname, 'uploads', file.filename + path.extname(file.originalname));
//     fs.renameSync(file.path, permanentPath);
    
//     // Save to file storage
//     const { fileStorage } = require('./config/fileStorage');
    
//     const document = {
//       title: file.originalname.replace(/\.[^/.]+$/, ""), // Remove extension
//       filename: file.originalname,
//       fileType,
//       fileSize: file.size,
//       uploadDate: new Date(),
//       content: sampleContent,
//       classification,
//       filePath: permanentPath
//     };
    
//     const result = await fileStorage.insertDocument(document);
    
//     res.json({
//       success: true,
//       message: 'Document uploaded and classified successfully!',
//       document: {
//         id: result.insertedId,
//         title: document.title,
//         filename: document.filename,
//         fileType: document.fileType,
//         fileSize: document.fileSize,
//         classification: document.classification,
//         uploadDate: document.uploadDate
//       }
//     });
    
//   } catch (error) {
//     console.error('❌ Upload error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Upload failed',
//       error: error.message
//     });
//   }
// });

// // Get all documents
// app.get('/documents', async (req, res) => {
//   try {
//     const { fileStorage } = require('./config/fileStorage');
//     const documents = await fileStorage.findDocuments();
    
//     res.json({
//       success: true,
//       totalDocuments: documents.length,
//       documents: documents.map(doc => ({
//         id: doc._id,
//         title: doc.title,
//         filename: doc.filename,
//         fileType: doc.fileType,
//         fileSize: doc.fileSize,
//         uploadDate: doc.uploadDate,
//         classification: doc.classification
//       }))
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get documents',
//       error: error.message
//     });
//   }
// });

// // Search documents
// app.get('/search', async (req, res) => {
//   try {
//     const { query } = req.query;
    
//     if (!query) {
//       return res.status(400).json({
//         success: false,
//         message: 'Search query is required'
//       });
//     }
    
//     const { fileStorage } = require('./config/fileStorage');
//     const results = await fileStorage.searchDocuments(query);
    
//     res.json({
//       success: true,
//       query,
//       totalResults: results.length,
//       results: results.map(doc => ({
//         id: doc._id,
//         title: doc.title,
//         filename: doc.filename,
//         classification: doc.classification,
//         snippet: doc.content ? doc.content.substring(0, 200) + '...' : ''
//       }))
//     });
    
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Search failed',
//       error: error.message
//     });
//   }
// });

// // Get statistics
// app.get('/statistics', async (req, res) => {
//   try {
//     const { fileStorage } = require('./config/fileStorage');
//     const stats = await fileStorage.getStats();
    
//     res.json({
//       success: true,
//       ...stats,
//       timestamp: new Date().toISOString()
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get statistics',
//       error: error.message
//     });
//   }
// });

// // Get classifications
// app.get('/classifications', async (req, res) => {
//   try {
//     const { fileStorage } = require('./config/fileStorage');
//     const classifications = await fileStorage.findClassifications();
    
//     res.json({
//       success: true,
//       totalClassifications: classifications.length,
//       classifications
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get classifications',
//       error: error.message
//     });
//   }
// });

// const port = process.env.PORT || 5000;

// app.listen(port, () => {
//     console.log('🚀 ====================================');
//     console.log(`🚀 Server running on port ${port}`);
//     console.log(`📁 Using File Storage (Local)`);
//     console.log(`🏠 Home: http://localhost:${port}/`);
//     console.log(`📊 Upload: POST http://localhost:${port}/upload-document`);
//     console.log(`📄 Documents: http://localhost:${port}/documents`);
//     console.log(`🔍 Search: http://localhost:${port}/search?query=test`);
//     console.log('🚀 ====================================');
//     console.log('');
//     console.log('💡 Ready to upload your technology documents!');
// });

// module.exports = app;



const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

console.log('🚀 Starting server with File Storage and Delete functionality...');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/temp/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.docx', '.doc'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOCX, and DOC files are allowed'), false);
    }
  }
});

// Ensure directories exist
const uploadsDir = path.join(__dirname, 'uploads');
const tempDir = path.join(__dirname, 'uploads', 'temp');
const dataDir = path.join(__dirname, 'data');
[uploadsDir, tempDir, dataDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Enhanced File Storage with Delete functionality
const { fileStorage } = require('./config/fileStorage');

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'Cloud Document Analytics API - Technology Focus (File Storage Mode)',
    status: 'Server is running with File Storage!',
    storageMode: 'File Storage (Local)',
    timestamp: new Date().toISOString(),
    endpoints: {
      upload: 'POST /upload-document',
      documents: 'GET /documents',
      deleteDocument: 'DELETE /documents/:id',
      downloadDocument: 'GET /documents/:id/download',
      search: 'GET /search?query=your-search',
      classifications: 'GET /classifications',
      statistics: 'GET /statistics',
      health: 'GET /health'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    storageMode: 'File Storage',
    timestamp: new Date().toISOString()
  });
});

// Initialize classifications
app.get('/init-classifications', async (req, res) => {
  try {
    // Simple tech classifications for file storage
    const classifications = [
      { id: 'web-dev', name: 'Web Development', keywords: ['html', 'css', 'javascript', 'react', 'vue', 'angular', 'node.js'] },
      { id: 'mobile-dev', name: 'Mobile Development', keywords: ['android', 'ios', 'mobile', 'flutter', 'react native'] },
      { id: 'data-science', name: 'Data Science', keywords: ['python', 'pandas', 'numpy', 'data analysis', 'machine learning'] },
      { id: 'ai-ml', name: 'AI & Machine Learning', keywords: ['artificial intelligence', 'neural network', 'tensorflow', 'pytorch'] },
      { id: 'cloud', name: 'Cloud Computing', keywords: ['aws', 'azure', 'google cloud', 'kubernetes', 'docker'] },
      { id: 'database', name: 'Database', keywords: ['sql', 'mongodb', 'postgresql', 'mysql', 'database'] },
      { id: 'cybersecurity', name: 'Cybersecurity', keywords: ['security', 'encryption', 'firewall', 'vulnerability'] }
    ];
    
    await fileStorage.insertClassifications(classifications);
    
    res.json({
      success: true,
      message: 'Technology classifications initialized!',
      totalCategories: classifications.length,
      categories: classifications.map(c => c.name)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to initialize classifications',
      error: error.message
    });
  }
});

// Upload document
app.post('/upload-document', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const file = req.file;
    const fileType = path.extname(file.originalname).toLowerCase().substring(1);
    
    console.log(`📄 Processing: ${file.originalname}`);
    
    // For demo purposes, create some sample content and classification
    const sampleContent = `Sample content for ${file.originalname}. This document contains technology-related information.`;
    
    // Simple classification based on filename
    let classification = 'Unclassified';
    const filename = file.originalname.toLowerCase();
    if (filename.includes('web') || filename.includes('html') || filename.includes('css') || filename.includes('javascript')) {
      classification = 'Web Development';
    } else if (filename.includes('mobile') || filename.includes('android') || filename.includes('ios')) {
      classification = 'Mobile Development';
    } else if (filename.includes('data') || filename.includes('python') || filename.includes('analysis')) {
      classification = 'Data Science';
    } else if (filename.includes('cloud') || filename.includes('aws') || filename.includes('docker')) {
      classification = 'Cloud Computing';
    }
    
    // Move file to permanent location
    const permanentPath = path.join(__dirname, 'uploads', file.filename + path.extname(file.originalname));
    fs.renameSync(file.path, permanentPath);
    
    // Save to file storage
    const document = {
      title: file.originalname.replace(/\.[^/.]+$/, ""), // Remove extension
      filename: file.originalname,
      fileType,
      fileSize: file.size,
      uploadDate: new Date(),
      content: sampleContent,
      classification,
      filePath: permanentPath
    };
    
    const result = await fileStorage.insertDocument(document);
    
    res.json({
      success: true,
      message: 'Document uploaded and classified successfully!',
      document: {
        id: result.insertedId,
        title: document.title,
        filename: document.filename,
        fileType: document.fileType,
        fileSize: document.fileSize,
        classification: document.classification,
        uploadDate: document.uploadDate
      }
    });
    
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
});

// Get all documents
app.get('/documents', async (req, res) => {
  try {
    const documents = await fileStorage.findDocuments();
    
    res.json({
      success: true,
      totalDocuments: documents.length,
      documents: documents.map(doc => ({
        id: doc._id,
        title: doc.title,
        filename: doc.filename,
        fileType: doc.fileType,
        fileSize: doc.fileSize,
        uploadDate: doc.uploadDate,
        classification: doc.classification
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get documents',
      error: error.message
    });
  }
});

// DELETE document - NEW FUNCTIONALITY
app.delete('/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Deleting document with ID: ${id}`);
    
    // Find the document first to get file path
    const document = await fileStorage.findDocumentById(id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    
    // Delete physical file if it exists
    if (document.filePath && fs.existsSync(document.filePath)) {
      try {
        fs.unlinkSync(document.filePath);
        console.log(`✅ Deleted physical file: ${document.filePath}`);
      } catch (fileError) {
        console.warn(`⚠️ Could not delete physical file: ${fileError.message}`);
      }
    }
    
    // Delete from file storage
    await fileStorage.deleteDocument(id);
    
    res.json({
      success: true,
      message: 'Document deleted successfully',
      documentId: id
    });
    
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete document',
      error: error.message
    });
  }
});

// DOWNLOAD document - NEW FUNCTIONALITY
app.get('/documents/:id/download', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📥 Download request for document ID: ${id}`);
    
    // Find the document
    const document = await fileStorage.findDocumentById(id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    
    // Check if physical file exists
    if (!document.filePath || !fs.existsSync(document.filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Physical file not found on server'
      });
    }
    
    // Set appropriate headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${document.filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    // Stream the file
    const fileStream = fs.createReadStream(document.filePath);
    fileStream.pipe(res);
    
    console.log(`✅ File download started: ${document.filename}`);
    
  } catch (error) {
    console.error('❌ Download error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download document',
      error: error.message
    });
  }
});

// Search documents
app.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const results = await fileStorage.searchDocuments(query);
    
    res.json({
      success: true,
      query,
      totalResults: results.length,
      results: results.map(doc => ({
        id: doc._id,
        title: doc.title,
        filename: doc.filename,
        classification: doc.classification,
        snippet: doc.content ? doc.content.substring(0, 200) + '...' : ''
      }))
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
});

// Get statistics
app.get('/statistics', async (req, res) => {
  try {
    const stats = await fileStorage.getStats();
    
    res.json({
      success: true,
      ...stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get statistics',
      error: error.message
    });
  }
});

// Get classifications
app.get('/classifications', async (req, res) => {
  try {
    const classifications = await fileStorage.findClassifications();
    
    res.json({
      success: true,
      totalClassifications: classifications.length,
      classifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get classifications',
      error: error.message
    });
  }
});

app.post('/classifications/:documentId/classify', async (req, res) => {
  try {
    const { documentId } = req.params;
    const { classificationId } = req.body;
    
    console.log(`🏷️ Manual classification request: Document ${documentId} -> Classification ${classificationId}`);
    
    if (!classificationId) {
      return res.status(400).json({
        success: false,
        message: 'Classification ID is required'
      });
    }
    
    // Get the document
    const document = await fileStorage.findDocumentById(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    
    // Get classifications
    const classifications = await fileStorage.findClassifications();
    const classification = classifications.find(cls => cls.id === classificationId);
    
    if (!classification) {
      return res.status(404).json({
        success: false,
        message: 'Classification not found'
      });
    }
    
    // Update document
    const updatedDocument = await fileStorage.updateDocument(documentId, {
      classification: classification.name,
      classificationId: classification.id,
      lastModified: new Date(),
      classificationMethod: 'manual'
    });
    
    console.log(`✅ Document "${document.title}" manually classified as "${classification.name}"`);
    
    res.json({
      success: true,
      message: 'Document classified successfully',
      documentId,
      classificationId,
      classificationName: classification.name,
      document: {
        id: updatedDocument._id,
        title: updatedDocument.title,
        classification: updatedDocument.classification
      }
    });
    
  } catch (error) {
    console.error('❌ Manual classification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to classify document',
      error: error.message
    });
  }
});

// AUTO-CLASSIFICATION ROUTE - ADD THIS TO YOUR test.js (if not already present)
app.post('/classifications/auto-classify', async (req, res) => {
  try {
    console.log('🤖 Starting auto-classification...');
    
    // Initialize classifications first
    await axios.get('http://localhost:5000/init-classifications');
    
    const documents = await fileStorage.findDocuments();
    const classifications = await fileStorage.findClassifications();
    
    let classifiedCount = 0;
    
    const updatedDocuments = documents.map(doc => {
      if (doc.classification === 'Unclassified' || !doc.classification) {
        const content = (doc.content || '').toLowerCase();
        const title = (doc.title || '').toLowerCase();
        const filename = (doc.filename || '').toLowerCase();
        const fullText = `${content} ${title} ${filename}`;
        
        let bestMatch = null;
        let highestScore = 0;
        
        classifications.forEach(cls => {
          let score = 0;
          if (cls.keywords) {
            cls.keywords.forEach(keyword => {
              const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'g');
              const matches = fullText.match(regex);
              if (matches) {
                score += matches.length;
              }
            });
          }
          
          if (score > highestScore) {
            highestScore = score;
            bestMatch = cls;
          }
        });
        
        if (bestMatch && highestScore > 0) {
          doc.classification = bestMatch.name;
          doc.classificationId = bestMatch.id;
          doc.classificationMethod = 'auto';
          classifiedCount++;
        }
      }
      return doc;
    });
    
    await fileStorage.saveDocuments(updatedDocuments);
    
    res.json({
      success: true,
      message: 'Auto-classification completed',
      total: documents.length,
      classified: classifiedCount,
      unprocessed: documents.length - classifiedCount
    });
    
  } catch (error) {
    console.error('❌ Auto-classification error:', error);
    res.status(500).json({
      success: false,
      message: 'Auto-classification failed',
      error: error.message
    });
  }
});

// CLASSIFICATION STATS ROUTE - ADD THIS TO YOUR test.js
app.get('/classifications/stats', async (req, res) => {
  try {
    const documents = await fileStorage.findDocuments();
    
    const stats = {};
    documents.forEach(doc => {
      const classification = doc.classification || 'Unclassified';
      stats[classification] = (stats[classification] || 0) + 1;
    });
    
    const statsArray = Object.entries(stats).map(([name, count]) => ({
      _id: name,
      count: count
    })).sort((a, b) => b.count - a.count);
    
    res.json({
      success: true,
      stats: statsArray
    });
    
  } catch (error) {
    console.error('❌ Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get statistics',
      error: error.message
    });
  }
});


// ADD THESE ROUTES TO YOUR test.js FILE
// Place them after your existing routes but before the app.listen() call

// MANUAL CLASSIFICATION ROUTE
app.post('/classifications/:documentId/classify', async (req, res) => {
  try {
    const { documentId } = req.params;
    const { classificationId } = req.body;
    
    console.log(`🏷️ Manual classification request: Document ${documentId} -> Classification ${classificationId}`);
    
    if (!classificationId) {
      return res.status(400).json({
        success: false,
        message: 'Classification ID is required'
      });
    }
    
    // Get the document
    const document = await fileStorage.findDocumentById(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    
    // Get classifications
    const classifications = await fileStorage.findClassifications();
    const classification = classifications.find(cls => cls.id === classificationId);
    
    if (!classification) {
      return res.status(404).json({
        success: false,
        message: 'Classification not found'
      });
    }
    
    // Update document
    const updatedDocument = await fileStorage.updateDocument(documentId, {
      classification: classification.name,
      classificationId: classification.id,
      lastModified: new Date(),
      classificationMethod: 'manual'
    });
    
    console.log(`✅ Document "${document.title}" manually classified as "${classification.name}"`);
    
    res.json({
      success: true,
      message: 'Document classified successfully',
      documentId,
      classificationId,
      classificationName: classification.name,
      document: {
        id: updatedDocument._id,
        title: updatedDocument.title,
        classification: updatedDocument.classification
      }
    });
    
  } catch (error) {
    console.error('❌ Manual classification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to classify document',
      error: error.message
    });
  }
});

// AUTO-CLASSIFICATION ROUTE (Enhanced version)
app.post('/classifications/auto-classify', async (req, res) => {
  try {
    console.log('🤖 Starting auto-classification...');
    
    // Make sure classifications are initialized
    const classifications = await fileStorage.findClassifications();
    if (classifications.length === 0) {
      console.log('No classifications found, initializing...');
      await initializeClassifications(); // This calls your existing init function
    }
    
    const documents = await fileStorage.findDocuments();
    const updatedClassifications = await fileStorage.findClassifications();
    
    let classifiedCount = 0;
    let alreadyClassified = 0;
    
    console.log(`Processing ${documents.length} documents with ${updatedClassifications.length} classification categories`);
    
    const updatedDocuments = documents.map(doc => {
      // Only process unclassified documents
      if (doc.classification === 'Unclassified' || !doc.classification || doc.classification === '') {
        const content = (doc.content || '').toLowerCase();
        const title = (doc.title || '').toLowerCase();
        const filename = (doc.filename || '').toLowerCase();
        const fullText = `${content} ${title} ${filename}`;
        
        let bestMatch = null;
        let highestScore = 0;
        
        // Score each classification based on keywords
        updatedClassifications.forEach(cls => {
          let score = 0;
          if (cls.keywords && cls.keywords.length > 0) {
            cls.keywords.forEach(keyword => {
              const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'g');
              const matches = fullText.match(regex);
              if (matches) {
                score += matches.length;
              }
            });
          }
          
          if (score > highestScore) {
            highestScore = score;
            bestMatch = cls;
          }
        });
        
        // Apply classification if we found a good match
        if (bestMatch && highestScore > 0) {
          doc.classification = bestMatch.name;
          doc.classificationId = bestMatch.id;
          doc.classificationScore = highestScore;
          doc.classificationMethod = 'auto';
          doc.lastModified = new Date();
          classifiedCount++;
          console.log(`📊 Auto-classified "${doc.title}" as "${bestMatch.name}" (score: ${highestScore})`);
        } else {
          console.log(`⚠️ No suitable classification found for "${doc.title}"`);
        }
      } else {
        alreadyClassified++;
        console.log(`⏭️ Skipping "${doc.title}" (already classified as "${doc.classification}")`);
      }
      return doc;
    });
    
    // Save updated documents
    await fileStorage.saveDocuments(updatedDocuments);
    
    console.log(`✅ Auto-classification completed: ${classifiedCount} newly classified, ${alreadyClassified} already classified`);
    
    res.json({
      success: true,
      message: `Auto-classification completed! ${classifiedCount} documents were classified.`,
      total: documents.length,
      classified: classifiedCount,
      alreadyClassified: alreadyClassified,
      unprocessed: documents.length - classifiedCount - alreadyClassified
    });
    
  } catch (error) {
    console.error('❌ Auto-classification error:', error);
    res.status(500).json({
      success: false,
      message: 'Auto-classification failed',
      error: error.message
    });
  }
});

// CLASSIFICATION STATISTICS ROUTE
app.get('/classifications/stats', async (req, res) => {
  try {
    const documents = await fileStorage.findDocuments();
    
    // Group documents by classification
    const stats = {};
    documents.forEach(doc => {
      const classification = doc.classification || 'Unclassified';
      stats[classification] = (stats[classification] || 0) + 1;
    });
    
    // Convert to array format and sort by count
    const statsArray = Object.entries(stats).map(([name, count]) => ({
      _id: name,
      name: name,
      count: count
    })).sort((a, b) => b.count - a.count);
    
    res.json({
      success: true,
      stats: statsArray,
      totalDocuments: documents.length
    });
    
  } catch (error) {
    console.error('❌ Classification stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get classification statistics',
      error: error.message
    });
  }
});

// HELPER FUNCTION - Initialize classifications (if not already in your code)
async function initializeClassifications() {
  const classifications = [
    { id: 'web-dev', name: 'Web Development', keywords: ['html', 'css', 'javascript', 'react', 'vue', 'angular', 'node.js', 'frontend', 'backend', 'web'] },
    { id: 'mobile-dev', name: 'Mobile Development', keywords: ['android', 'ios', 'mobile', 'flutter', 'react native', 'swift', 'kotlin', 'app'] },
    { id: 'data-science', name: 'Data Science', keywords: ['python', 'pandas', 'numpy', 'data analysis', 'machine learning', 'statistics', 'analytics'] },
    { id: 'ai-ml', name: 'AI & Machine Learning', keywords: ['artificial intelligence', 'neural network', 'tensorflow', 'pytorch', 'deep learning', 'ai', 'ml'] },
    { id: 'cloud', name: 'Cloud Computing', keywords: ['aws', 'azure', 'google cloud', 'kubernetes', 'docker', 'cloud', 'devops'] },
    { id: 'database', name: 'Database', keywords: ['sql', 'mongodb', 'postgresql', 'mysql', 'database', 'nosql', 'redis'] },
    { id: 'cybersecurity', name: 'Cybersecurity', keywords: ['security', 'encryption', 'firewall', 'vulnerability', 'cybersecurity', 'hacking', 'penetration testing'] }
  ];
  
  await fileStorage.insertClassifications(classifications);
  console.log(`✅ Initialized ${classifications.length} classification categories`);
  return classifications;
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('🚀 ====================================');
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📁 Using Enhanced File Storage (Local) with Delete/Download`);
    console.log(`🏠 Home: http://localhost:${port}/`);
    console.log(`📊 Upload: POST http://localhost:${port}/upload-document`);
    console.log(`📄 Documents: http://localhost:${port}/documents`);
    console.log(`🗑️ Delete: DELETE http://localhost:${port}/documents/:id`);
    console.log(`📥 Download: GET http://localhost:${port}/documents/:id/download`);
    console.log(`🔍 Search: http://localhost:${port}/search?query=test`);
    console.log('🚀 ====================================');
    console.log('');
    console.log('💡 Ready to upload, manage, and delete your technology documents!');
});

module.exports = app;