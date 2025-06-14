// services/classificationService.js
const { getCollections } = require('../config/db');
const logger = require('../utils/logger');

// Technology Classification Tree
const TECH_CLASSIFICATION_TREE = [
  {
    id: 'tech-001',
    name: 'Software Development',
    parentId: null,
    keywords: ['programming', 'software', 'development', 'coding', 'application', 'system design'],
    children: [
      {
        id: 'tech-001-001',
        name: 'Web Development',
        parentId: 'tech-001',
        keywords: ['html', 'css', 'javascript', 'react', 'vue', 'angular', 'node.js', 'express', 'web', 'frontend', 'backend']
      },
      {
        id: 'tech-001-002',
        name: 'Mobile Development',
        parentId: 'tech-001',
        keywords: ['android', 'ios', 'mobile', 'react native', 'flutter', 'swift', 'kotlin', 'app development']
      },
      {
        id: 'tech-001-003',
        name: 'Desktop Development',
        parentId: 'tech-001',
        keywords: ['desktop', 'electron', 'wpf', 'java swing', 'qt', 'tkinter', 'gui']
      }
    ]
  },
  {
    id: 'tech-002',
    name: 'Data Science & Analytics',
    parentId: null,
    keywords: ['data science', 'analytics', 'statistics', 'visualization', 'big data'],
    children: [
      {
        id: 'tech-002-001',
        name: 'Machine Learning',
        parentId: 'tech-002',
        keywords: ['machine learning', 'ml', 'neural network', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn']
      },
      {
        id: 'tech-002-002',
        name: 'Artificial Intelligence',
        parentId: 'tech-002',
        keywords: ['artificial intelligence', 'ai', 'nlp', 'computer vision', 'chatbot', 'automation']
      },
      {
        id: 'tech-002-003',
        name: 'Data Engineering',
        parentId: 'tech-002',
        keywords: ['etl', 'data pipeline', 'apache spark', 'hadoop', 'kafka', 'data warehouse']
      }
    ]
  },
  {
    id: 'tech-003',
    name: 'Cloud Computing',
    parentId: null,
    keywords: ['cloud', 'aws', 'azure', 'google cloud', 'kubernetes', 'docker'],
    children: [
      {
        id: 'tech-003-001',
        name: 'Cloud Platforms',
        parentId: 'tech-003',
        keywords: ['aws', 'amazon web services', 'microsoft azure', 'google cloud platform', 'gcp']
      },
      {
        id: 'tech-003-002',
        name: 'DevOps & Containerization',
        parentId: 'tech-003',
        keywords: ['devops', 'docker', 'kubernetes', 'ci/cd', 'jenkins', 'gitlab', 'containerization']
      },
      {
        id: 'tech-003-003',
        name: 'Serverless Computing',
        parentId: 'tech-003',
        keywords: ['serverless', 'lambda', 'azure functions', 'cloud functions', 'microservices']
      }
    ]
  },
  {
    id: 'tech-004',
    name: 'Cybersecurity',
    parentId: null,
    keywords: ['security', 'cybersecurity', 'encryption', 'firewall', 'vulnerability'],
    children: [
      {
        id: 'tech-004-001',
        name: 'Network Security',
        parentId: 'tech-004',
        keywords: ['network security', 'firewall', 'vpn', 'intrusion detection', 'penetration testing']
      },
      {
        id: 'tech-004-002',
        name: 'Application Security',
        parentId: 'tech-004',
        keywords: ['application security', 'owasp', 'sql injection', 'xss', 'csrf', 'secure coding']
      }
    ]
  },
  {
    id: 'tech-005',
    name: 'Database & Storage',
    parentId: null,
    keywords: ['database', 'sql', 'nosql', 'mongodb', 'mysql', 'postgresql'],
    children: [
      {
        id: 'tech-005-001',
        name: 'Relational Databases',
        parentId: 'tech-005',
        keywords: ['sql', 'mysql', 'postgresql', 'oracle', 'sql server', 'relational']
      },
      {
        id: 'tech-005-002',
        name: 'NoSQL Databases',
        parentId: 'tech-005',
        keywords: ['nosql', 'mongodb', 'cassandra', 'redis', 'elasticsearch', 'document database']
      }
    ]
  }
];

// Initialize classification data in database
async function initializeClassificationTree() {
  try {
    const { classificationsCollection } = await getCollections();
    
    // Clear existing classifications
    await classificationsCollection.deleteMany({});
    
    // Flatten the tree structure for database storage
    const flatClassifications = [];
    
    const addToFlat = (nodes, parentId = null) => {
      nodes.forEach(node => {
        flatClassifications.push({
          id: node.id,
          name: node.name,
          parentId: node.parentId,
          keywords: node.keywords || []
        });
        
        if (node.children) {
          addToFlat(node.children, node.id);
        }
      });
    };
    
    addToFlat(TECH_CLASSIFICATION_TREE);
    
    // Insert all classifications
    await classificationsCollection.insertMany(flatClassifications);
    
    logger.info(`Initialized ${flatClassifications.length} classification categories`);
    return flatClassifications;
  } catch (error) {
    logger.error(`Classification initialization error: ${error.message}`);
    throw error;
  }
}

// Classify document content using keyword matching
function classifyDocumentContent(content) {
  const contentLower = content.toLowerCase();
  const scores = {};
  
  // Flatten all classifications for scoring
  const flatClassifications = [];
  const addToFlat = (nodes) => {
    nodes.forEach(node => {
      flatClassifications.push(node);
      if (node.children) {
        addToFlat(node.children);
      }
    });
  };
  addToFlat(TECH_CLASSIFICATION_TREE);
  
  // Score each classification based on keyword matches
  flatClassifications.forEach(classification => {
    let score = 0;
    classification.keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'g');
      const matches = contentLower.match(regex);
      if (matches) {
        score += matches.length;
      }
    });
    
    if (score > 0) {
      scores[classification.id] = {
        id: classification.id,
        name: classification.name,
        score: score,
        parentId: classification.parentId
      };
    }
  });
  
  // Find the best match
  if (Object.keys(scores).length === 0) {
    return {
      id: 'unclassified',
      name: 'Unclassified',
      score: 0,
      confidence: 0
    };
  }
  
  // Get the classification with highest score
  const bestMatch = Object.values(scores).reduce((best, current) => 
    current.score > best.score ? current : best
  );
  
  // Calculate confidence (simple approach)
  const totalScore = Object.values(scores).reduce((sum, item) => sum + item.score, 0);
  const confidence = totalScore > 0 ? (bestMatch.score / totalScore) * 100 : 0;
  
  return {
    ...bestMatch,
    confidence: Math.round(confidence)
  };
}

// Auto-classify all unclassified documents
async function autoClassifyDocuments() {
  try {
    const { documentsCollection } = await getCollections();
    
    const unclassifiedDocs = await documentsCollection.find({
      $or: [
        { classification: 'Unclassified' },
        { classification: { $exists: false } }
      ]
    }).toArray();
    
    logger.info(`Found ${unclassifiedDocs.length} unclassified documents`);
    
    let classifiedCount = 0;
    
    for (const doc of unclassifiedDocs) {
      if (doc.content) {
        const classification = classifyDocumentContent(doc.content);
        
        await documentsCollection.updateOne(
          { _id: doc._id },
          { 
            $set: { 
              classification: classification.name,
              classificationId: classification.id,
              classificationConfidence: classification.confidence
            }
          }
        );
        
        classifiedCount++;
        logger.info(`Classified document "${doc.title}" as "${classification.name}" (${classification.confidence}% confidence)`);
      }
    }
    
    return {
      total: unclassifiedDocs.length,
      classified: classifiedCount,
      unprocessed: unclassifiedDocs.length - classifiedCount
    };
  } catch (error) {
    logger.error(`Auto-classification error: ${error.message}`);
    throw error;
  }
}

module.exports = {
  TECH_CLASSIFICATION_TREE,
  initializeClassificationTree,
  classifyDocumentContent,
  autoClassifyDocuments
};