// // controllers/classificationController.js - Fixed for File Storage
// const { fileStorage } = require('../config/fileStorage');
// const logger = require('../utils/logger');

// // Get classification tree
// exports.getClassificationTree = async (req, res) => {
//   try {
//     const classifications = await fileStorage.findClassifications();
    
//     // Convert flat list to hierarchical tree if needed
//     const tree = classifications.map(item => ({
//       id: item.id,
//       name: item.name,
//       keywords: item.keywords || [],
//       children: [] // For now, keeping it flat
//     }));
    
//     res.status(200).json(tree);
//   } catch (error) {
//     logger.error(`Get Classification Tree Error: ${error.message}`);
//     res.status(500).json({ message: 'Server error fetching classification tree' });
//   }
// };

// // Classify document
// exports.classifyDocument = async (req, res) => {
//   try {
//     const { documentId } = req.params;
//     const { classificationId } = req.body;
    
//     if (!classificationId) {
//       return res.status(400).json({ message: 'Classification ID is required' });
//     }
    
//     // Get all documents
//     const documents = await fileStorage.findDocuments();
//     const document = documents.find(doc => doc._id === documentId);
    
//     if (!document) {
//       return res.status(404).json({ message: 'Document not found' });
//     }
    
//     // Get classifications
//     const classifications = await fileStorage.findClassifications();
//     const classification = classifications.find(cls => cls.id === classificationId);
    
//     if (!classification) {
//       return res.status(404).json({ message: 'Classification not found' });
//     }
    
//     // Update document classification
//     document.classification = classification.name;
//     document.classificationId = classification.id;
    
//     // Save back to file storage
//     const updatedDocuments = documents.map(doc => 
//       doc._id === documentId ? document : doc
//     );
    
//     await fileStorage.saveDocuments(updatedDocuments);
    
//     res.status(200).json({
//       success: true,
//       message: 'Document classified successfully',
//       documentId,
//       classificationId,
//       classificationName: classification.name
//     });
//   } catch (error) {
//     logger.error(`Classify Document Error: ${error.message}`);
//     res.status(500).json({ message: 'Server error classifying document' });
//   }
// };

// // Auto-classify all documents
// exports.autoClassifyAll = async (req, res) => {
//   try {
//     const documents = await fileStorage.findDocuments();
//     const classifications = await fileStorage.findClassifications();
    
//     let classifiedCount = 0;
    
//     // Simple keyword-based classification
//     const updatedDocuments = documents.map(doc => {
//       if (doc.classification === 'Unclassified' || !doc.classification) {
//         const content = (doc.content || '').toLowerCase();
//         const title = (doc.title || '').toLowerCase();
//         const filename = (doc.filename || '').toLowerCase();
        
//         // Combine all text for classification
//         const fullText = `${content} ${title} ${filename}`;
        
//         let bestMatch = null;
//         let highestScore = 0;
        
//         // Score each classification
//         classifications.forEach(cls => {
//           let score = 0;
//           cls.keywords.forEach(keyword => {
//             const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'g');
//             const matches = fullText.match(regex);
//             if (matches) {
//               score += matches.length;
//             }
//           });
          
//           if (score > highestScore) {
//             highestScore = score;
//             bestMatch = cls;
//           }
//         });
        
//         if (bestMatch && highestScore > 0) {
//           doc.classification = bestMatch.name;
//           doc.classificationId = bestMatch.id;
//           classifiedCount++;
//         }
//       }
//       return doc;
//     });
    
//     // Save updated documents
//     await fileStorage.saveDocuments(updatedDocuments);
    
//     res.status(200).json({
//       success: true,
//       message: 'Auto-classification completed',
//       total: documents.length,
//       classified: classifiedCount,
//       unprocessed: documents.length - classifiedCount
//     });
//   } catch (error) {
//     logger.error(`Auto-classify Error: ${error.message}`);
//     res.status(500).json({ message: 'Server error during auto-classification' });
//   }
// };

// // Get classification statistics
// exports.getClassificationStats = async (req, res) => {
//   try {
//     const documents = await fileStorage.findDocuments();
    
//     // Group documents by classification
//     const stats = {};
//     documents.forEach(doc => {
//       const classification = doc.classification || 'Unclassified';
//       stats[classification] = (stats[classification] || 0) + 1;
//     });
    
//     // Convert to array format
//     const statsArray = Object.entries(stats).map(([name, count]) => ({
//       _id: name,
//       count: count
//     })).sort((a, b) => b.count - a.count);
    
//     res.status(200).json(statsArray);
//   } catch (error) {
//     logger.error(`Classification Stats Error: ${error.message}`);
//     res.status(500).json({ message: 'Server error fetching classification statistics' });
//   }
// };


// controllers/classificationController.js - Fixed for File Storage with Manual Classification
const { fileStorage } = require('../config/fileStorage');
const logger = require('../utils/logger');

// Get classification tree
exports.getClassificationTree = async (req, res) => {
  try {
    const classifications = await fileStorage.findClassifications();
    
    // Convert flat list to hierarchical tree if needed
    const tree = classifications.map(item => ({
      id: item.id,
      name: item.name,
      keywords: item.keywords || [],
      children: [] // For now, keeping it flat
    }));
    
    res.status(200).json(tree);
  } catch (error) {
    logger.error(`Get Classification Tree Error: ${error.message}`);
    res.status(500).json({ message: 'Server error fetching classification tree' });
  }
};

// Classify document - FIXED FOR FILE STORAGE
exports.classifyDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { classificationId } = req.body;
    
    console.log(`🏷️ Manual classification request: Document ${documentId} -> Classification ${classificationId}`);
    
    if (!classificationId) {
      return res.status(400).json({ message: 'Classification ID is required' });
    }
    
    // Get the document first
    const document = await fileStorage.findDocumentById(documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // Get classifications to find the selected one
    const classifications = await fileStorage.findClassifications();
    const classification = classifications.find(cls => cls.id === classificationId);
    
    if (!classification) {
      return res.status(404).json({ message: 'Classification not found' });
    }
    
    // Update document using the fileStorage updateDocument method
    const updatedDocument = await fileStorage.updateDocument(documentId, {
      classification: classification.name,
      classificationId: classification.id,
      lastModified: new Date(),
      classificationMethod: 'manual'
    });
    
    console.log(`✅ Document "${document.title}" classified as "${classification.name}"`);
    
    res.status(200).json({
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
    logger.error(`Classify Document Error: ${error.message}`);
    console.error('Full error:', error);
    res.status(500).json({ 
      message: 'Server error classifying document',
      error: error.message 
    });
  }
};

// Auto-classify all documents
exports.autoClassifyAll = async (req, res) => {
  try {
    console.log('🤖 Starting auto-classification process...');
    
    const documents = await fileStorage.findDocuments();
    const classifications = await fileStorage.findClassifications();
    
    let classifiedCount = 0;
    let updatedCount = 0;
    
    console.log(`Found ${documents.length} documents and ${classifications.length} classifications`);
    
    // Simple keyword-based classification
    const updatedDocuments = documents.map(doc => {
      // Only classify unclassified documents or those marked as 'Unclassified'
      if (doc.classification === 'Unclassified' || !doc.classification || doc.classification === '') {
        const content = (doc.content || '').toLowerCase();
        const title = (doc.title || '').toLowerCase();
        const filename = (doc.filename || '').toLowerCase();
        
        // Combine all text for classification
        const fullText = `${content} ${title} ${filename}`;
        
        let bestMatch = null;
        let highestScore = 0;
        
        // Score each classification based on keyword matches
        classifications.forEach(cls => {
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
        
        // Only classify if we found a good match (score > 0)
        if (bestMatch && highestScore > 0) {
          doc.classification = bestMatch.name;
          doc.classificationId = bestMatch.id;
          doc.classificationScore = highestScore;
          doc.classificationMethod = 'auto';
          doc.lastModified = new Date();
          classifiedCount++;
          updatedCount++;
          
          console.log(`📊 Classified "${doc.title}" as "${bestMatch.name}" (score: ${highestScore})`);
        } else {
          console.log(`⚠️ No classification found for "${doc.title}"`);
        }
      } else {
        console.log(`⏭️ Skipping "${doc.title}" (already classified as "${doc.classification}")`);
      }
      return doc;
    });
    
    // Save updated documents
    if (updatedCount > 0) {
      await fileStorage.saveDocuments(updatedDocuments);
      console.log(`✅ Auto-classification completed: ${classifiedCount} documents classified`);
    } else {
      console.log('ℹ️ No documents needed classification');
    }
    
    res.status(200).json({
      success: true,
      message: 'Auto-classification completed',
      total: documents.length,
      classified: classifiedCount,
      alreadyClassified: documents.length - documents.filter(d => 
        d.classification === 'Unclassified' || !d.classification || d.classification === ''
      ).length,
      unprocessed: documents.filter(d => 
        d.classification === 'Unclassified' || !d.classification || d.classification === ''
      ).length - classifiedCount
    });
  } catch (error) {
    logger.error(`Auto-classify Error: ${error.message}`);
    console.error('Full auto-classify error:', error);
    res.status(500).json({ 
      message: 'Server error during auto-classification',
      error: error.message 
    });
  }
};

// Get classification statistics
exports.getClassificationStats = async (req, res) => {
  try {
    const documents = await fileStorage.findDocuments();
    
    // Group documents by classification
    const stats = {};
    documents.forEach(doc => {
      const classification = doc.classification || 'Unclassified';
      stats[classification] = (stats[classification] || 0) + 1;
    });
    
    // Convert to array format
    const statsArray = Object.entries(stats).map(([name, count]) => ({
      _id: name,
      count: count
    })).sort((a, b) => b.count - a.count);
    
    res.status(200).json(statsArray);
  } catch (error) {
    logger.error(`Classification Stats Error: ${error.message}`);
    res.status(500).json({ message: 'Server error fetching classification statistics' });
  }
};