// const pdfParse = require('pdf-parse');
// const mammoth = require('mammoth');
// const fs = require('fs');
// const logger = require('../utils/logger');

// // Extract text from PDF
// async function extractTextFromPDF(filePath) {
//   try {
//     const dataBuffer = fs.readFileSync(filePath);
//     const data = await pdfParse(dataBuffer);
//     return data.text;
//   } catch (error) {
//     logger.error(`PDF Extraction Error: ${error.message}`);
//     throw error;
//   }
// }

// // Extract text from DOCX
// async function extractTextFromDOCX(filePath) {
//   try {
//     const result = await mammoth.extractRawText({ path: filePath });
//     return result.value;
//   } catch (error) {
//     logger.error(`DOCX Extraction Error: ${error.message}`);
//     throw error;
//   }
// }

// // Extract text based on file type
// async function extractTextFromDocument(filePath, fileType) {
//   if (fileType === 'pdf') {
//     return extractTextFromPDF(filePath);
//   } else if (fileType === 'docx') {
//     return extractTextFromDOCX(filePath);
//   } else if (fileType === 'doc') {
//     // For .doc files, you might need a different library
//     return "Text extraction from .doc files is not supported yet.";
//   } else {
//     throw new Error(`Unsupported file type: ${fileType}`);
//   }
// }

// // Find matches in text for search
// function findSearchMatches(content, searchQuery) {
//   const matches = [];
//   const regex = new RegExp(searchQuery, 'gi');
//   let match;
  
//   // Find all matches
//   while ((match = regex.exec(content)) !== null) {
//     const position = match.index;
    
//     // Get surrounding context (50 characters before and after)
//     const start = Math.max(0, position - 50);
//     const end = Math.min(content.length, position + searchQuery.length + 50);
//     const text = content.substring(start, end);
    
//     matches.push({
//       text,
//       position
//     });
//   }
  
//   return matches;
// }

// module.exports = {
//   extractTextFromDocument,
//   findSearchMatches
// };

const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const logger = require('../utils/logger');

// Extract text from PDF
async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    logger.error(`PDF Extraction Error: ${error.message}`);
    throw error;
  }
}

// Extract text from DOCX
async function extractTextFromDOCX(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    logger.error(`DOCX Extraction Error: ${error.message}`);
    throw error;
  }
}

// Extract text based on file type
async function extractTextFromDocument(filePath, fileType) {
  if (fileType === 'pdf') {
    return extractTextFromPDF(filePath);
  } else if (fileType === 'docx') {
    return extractTextFromDOCX(filePath);
  } else if (fileType === 'doc') {
    // For .doc files, you might need a different library
    return "Text extraction from .doc files is not fully supported yet.";
  } else {
    throw new Error(`Unsupported file type: ${fileType}`);
  }
}

// Extract meaningful title from document content
function extractTitleFromContent(content, filename) {
  if (!content || content.trim().length === 0) {
    // Fallback to filename without extension
    return filename.split('.')[0].replace(/_/g, ' ').replace(/-/g, ' ');
  }
  
  const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  if (lines.length === 0) {
    return filename.split('.')[0].replace(/_/g, ' ').replace(/-/g, ' ');
  }
  
  // Look for potential title patterns
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    
    // Skip very short lines (likely not titles)
    if (line.length < 5) continue;
    
    // Skip lines that look like headers/footers
    if (line.toLowerCase().includes('page') || 
        line.toLowerCase().includes('chapter') ||
        line.match(/^\d+$/)) continue;
    
    // Skip lines with too many special characters
    if ((line.match(/[^a-zA-Z0-9\s]/g) || []).length > line.length * 0.3) continue;
    
    // If line looks like a title (reasonable length, starts with capital, not too long)
    if (line.length >= 10 && line.length <= 100 && 
        line[0] === line[0].toUpperCase() && 
        !line.endsWith('.')) {
      return line;
    }
  }
  
  // If no good title found, use first substantial line
  const firstLine = lines.find(line => line.length >= 10 && line.length <= 150);
  if (firstLine) {
    return firstLine.length > 80 ? firstLine.substring(0, 80) + '...' : firstLine;
  }
  
  // Ultimate fallback
  return filename.split('.')[0].replace(/_/g, ' ').replace(/-/g, ' ');
}

// Find matches in text for search with highlighting
function findSearchMatches(content, searchQuery) {
  const matches = [];
  const queryLower = searchQuery.toLowerCase();
  const contentLower = content.toLowerCase();
  
  // Split search query into individual terms
  const searchTerms = searchQuery.split(/\s+/).filter(term => term.length > 0);
  
  // Find matches for each term
  searchTerms.forEach(term => {
    const termLower = term.toLowerCase();
    const regex = new RegExp(`\\b${termLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      const position = match.index;
      
      // Get surrounding context (100 characters before and after)
      const contextStart = Math.max(0, position - 100);
      const contextEnd = Math.min(content.length, position + term.length + 100);
      
      // Find word boundaries for cleaner context
      let start = contextStart;
      let end = contextEnd;
      
      // Move start to nearest word boundary
      while (start > 0 && content[start] !== ' ' && content[start] !== '\n') {
        start--;
      }
      
      // Move end to nearest word boundary
      while (end < content.length && content[end] !== ' ' && content[end] !== '\n') {
        end++;
      }
      
      const contextText = content.substring(start, end).trim();
      
      // Highlight the matched term in the context
      const highlightedText = contextText.replace(
        new RegExp(`\\b${termLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi'),
        `**${match[0]}**`
      );
      
      matches.push({
        term: term,
        text: highlightedText,
        position: position,
        context: contextText,
        matchedText: match[0]
      });
    }
  });
  
  // Remove duplicates and sort by position
  const uniqueMatches = matches.filter((match, index, self) => 
    index === self.findIndex(m => m.position === match.position)
  );
  
  return uniqueMatches.sort((a, b) => a.position - b.position);
}

module.exports = {
  extractTextFromDocument,
  extractTitleFromContent,
  findSearchMatches
};