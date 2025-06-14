const { getCollections } = require('../config/db');
const logger = require('../utils/logger');

// Get system statistics
exports.getStatistics = async (req, res) => {
  try {
    const { documentsCollection } = await getCollections();
    
    // Get total documents
    const totalDocuments = await documentsCollection.countDocuments();
    
    // Get document types count
    const pdfCount = await documentsCollection.countDocuments({ fileType: 'pdf' });
    const docxCount = await documentsCollection.countDocuments({ fileType: 'docx' });
    const docCount = await documentsCollection.countDocuments({ fileType: 'doc' });
    
    // Get total size
    const documents = await documentsCollection.find().project({ fileSize: 1 }).toArray();
    const totalSize = documents.reduce((sum, doc) => sum + doc.fileSize, 0);
    
    // Calculate average size
    const averageSize = totalDocuments > 0 ? totalSize / totalDocuments : 0;
    
    // Mock performance metrics for now
    const performanceMetrics = {
      uploadTime: 245, // ms
      searchTime: 125, // ms
      sortTime: 56,   // ms
      classifyTime: 312 // ms
    };
    
    res.status(200).json({
      totalDocuments,
      totalSize,
      averageSize,
      documentTypes: {
        pdf: pdfCount,
        docx: docxCount,
        doc: docCount
      },
      performanceMetrics
    });
  } catch (error) {
    logger.error(`Get Statistics Error: ${error.message}`);
    res.status(500).json({ message: 'Server error fetching statistics' });
  }
};