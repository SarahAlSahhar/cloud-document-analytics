// // src/services/api.ts
// import { Document, SearchResult, ClassificationTree, Statistics } from '../types';
// import { mockDocuments, mockClassificationTree, mockStatistics, mockSearchResults } from './mock';

// // This is a mock implementation that will be replaced with real API calls later
// export const uploadDocument = async (file: File, onProgress?: (progress: number) => void): Promise<any> => {
//   // Simulate upload progress
//   if (onProgress) {
//     let progress = 0;
//     const interval = setInterval(() => {
//       progress += 10;
//       onProgress(progress);
//       if (progress >= 100) {
//         clearInterval(interval);
//       }
//     }, 300);
//   }
  
//   // Simulate network delay
//   await new Promise(resolve => setTimeout(resolve, 1500));
  
//   return {
//     success: true,
//     message: 'File uploaded successfully',
//     document: {
//       id: Date.now().toString(),
//       title: file.name.split('.')[0].replace(/_/g, ' '),
//       filename: file.name,
//       fileType: file.name.split('.').pop() as 'pdf' | 'docx' | 'doc',
//       fileSize: file.size,
//       uploadDate: new Date().toISOString(),
//       url: '#'
//     }
//   };
// };

// export const getAllDocuments = async (): Promise<Document[]> => {
//   // Simulate network delay
//   await new Promise(resolve => setTimeout(resolve, 500));
//   return mockDocuments;
// };

// export const sortDocuments = async (sortBy: string, order: 'asc' | 'desc'): Promise<Document[]> => {
//   // Simulate network delay
//   await new Promise(resolve => setTimeout(resolve, 500));
  
//   // Create a copy to avoid mutating the original
//   const sortedDocs = [...mockDocuments];
  
//   // Sort based on the provided field and order
//   sortedDocs.sort((a, b) => {
//     // Handle different types of fields appropriately
//     if (sortBy === 'fileSize' || sortBy === 'uploadDate') {
//       const aValue = a[sortBy];
//       const bValue = b[sortBy];
//       return order === 'asc' 
//         ? (aValue < bValue ? -1 : aValue > bValue ? 1 : 0)
//         : (aValue > bValue ? -1 : aValue < bValue ? 1 : 0);
//     } else {
//       const aValue = String(a[sortBy as keyof Document]).toLowerCase();
//       const bValue = String(b[sortBy as keyof Document]).toLowerCase();
//       return order === 'asc'
//         ? aValue.localeCompare(bValue)
//         : bValue.localeCompare(aValue);
//     }
//   });
  
//   return sortedDocs;
// };

// export const searchDocuments = async (query: string): Promise<SearchResult[]> => {
//   // Simulate network delay
//   await new Promise(resolve => setTimeout(resolve, 1000));
//   return mockSearchResults(query);
// };

// export const getDocumentById = async (id: string): Promise<Document> => {
//   // Simulate network delay
//   await new Promise(resolve => setTimeout(resolve, 300));
  
//   const document = mockDocuments.find(doc => doc.id === id);
//   if (!document) {
//     throw new Error('Document not found');
//   }
  
//   return document;
// };

// export const getClassificationTree = async (): Promise<ClassificationTree[]> => {
//   // Simulate network delay
//   await new Promise(resolve => setTimeout(resolve, 500));
//   return mockClassificationTree;
// };

// export const classifyDocument = async (documentId: string, classificationId: string): Promise<any> => {
//   // Simulate network delay
//   await new Promise(resolve => setTimeout(resolve, 800));
  
//   // Find the classification name
//   const findClassificationName = (tree: ClassificationTree[], id: string): string | null => {
//     for (const node of tree) {
//       if (node.id === id) return node.name;
      
//       if (node.children && node.children.length > 0) {
//         const found = findClassificationName(node.children, id);
//         if (found) return found;
//       }
//     }
    
//     return null;
//   };
  
//   const classificationName = findClassificationName(mockClassificationTree, classificationId);
  
//   return {
//     success: true,
//     message: 'Document classified successfully',
//     documentId,
//     classificationId,
//     classificationName
//   };
// };

// export const getStatistics = async (): Promise<Statistics> => {
//   // Simulate network delay
//   await new Promise(resolve => setTimeout(resolve, 700));
//   return mockStatistics;
// };

// export const downloadDocument = async (id: string): Promise<any> => {
//   // In a real implementation, this would return a blob
//   // For now, just simulate a delay
//   await new Promise(resolve => setTimeout(resolve, 1000));
//   return null;
// };

// export const deleteDocument = async (id: string): Promise<any> => {
//   // Simulate network delay
//   await new Promise(resolve => setTimeout(resolve, 500));
  
//   return {
//     success: true,
//     message: 'Document deleted successfully'
//   };
// };

// src/services/api.ts - REPLACE YOUR CURRENT api.ts WITH THIS
import { Document, SearchResult, ClassificationTree, Statistics } from '../types';

// Backend API base URL
const API_BASE = 'http://localhost:5000';

// Helper function for API calls
const apiCall = async (endpoint: string, options?: RequestInit) => {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

// Upload document to real backend
export const uploadDocument = async (file: File, onProgress?: (progress: number) => void): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('document', file);

    // Simulate progress if callback provided
    if (onProgress) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        onProgress(Math.min(progress, 90));
        if (progress >= 90) {
          clearInterval(interval);
        }
      }, 200);
    }

    const response = await fetch(`${API_BASE}/upload-document`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (onProgress) {
      onProgress(100);
    }

    return data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// Get all documents
export const getAllDocuments = async (): Promise<Document[]> => {
  try {
    const data = await apiCall('/documents');
    return data.documents || [];
  } catch (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
};

// Sort documents
export const sortDocuments = async (sortBy: string, order: 'asc' | 'desc'): Promise<Document[]> => {
  try {
    const data = await apiCall(`/documents/sort?sortBy=${sortBy}&order=${order}`);
    return data || [];
  } catch (error) {
    console.error('Error sorting documents:', error);
    throw error;
  }
};

// Search documents
export const searchDocuments = async (query: string): Promise<SearchResult[]> => {
  try {
    const data = await apiCall(`/search?query=${encodeURIComponent(query)}`);
    return data.results || [];
  } catch (error) {
    console.error('Error searching documents:', error);
    return [];
  }
};

// Get document by ID
export const getDocumentById = async (id: string): Promise<Document> => {
  try {
    const data = await apiCall(`/documents/${id}`);
    return data;
  } catch (error) {
    console.error('Error fetching document:', error);
    throw error;
  }
};

// Get classification tree
export const getClassificationTree = async (): Promise<ClassificationTree[]> => {
  try {
    const data = await apiCall('/classifications');
    return data.classifications || [];
  } catch (error) {
    console.error('Error fetching classifications:', error);
    return [];
  }
};

// Initialize classifications
export const initializeClassifications = async (): Promise<any> => {
  try {
    const data = await apiCall('/init-classifications');
    return data;
  } catch (error) {
    console.error('Error initializing classifications:', error);
    throw error;
  }
};

// Classify document
export const classifyDocument = async (documentId: string, classificationId: string): Promise<any> => {
  try {
    const data = await apiCall(`/classifications/${documentId}/classify`, {
      method: 'POST',
      body: JSON.stringify({ classificationId }),
    });
    return data;
  } catch (error) {
    console.error('Error classifying document:', error);
    throw error;
  }
};

// Get statistics
export const getStatistics = async (): Promise<Statistics> => {
  try {
    const data = await apiCall('/statistics');
    
    // Transform backend response to match frontend interface
    return {
      totalDocuments: data.totalDocuments || 0,
      totalSize: data.totalSize || 0,
      averageSize: data.averageSize || 0,
      documentTypes: {
        pdf: data.documentTypes?.pdf || 0,
        docx: data.documentTypes?.docx || 0,
        doc: data.documentTypes?.doc || 0,
      },
      performanceMetrics: {
        uploadTime: 245, // Mock values for now
        searchTime: 125,
        sortTime: 56,
        classifyTime: 312,
      }
    };
  } catch (error) {
    console.error('Error fetching statistics:', error);
    // Return empty statistics instead of throwing
    return {
      totalDocuments: 0,
      totalSize: 0,
      averageSize: 0,
      documentTypes: { pdf: 0, docx: 0, doc: 0 },
      performanceMetrics: { uploadTime: 0, searchTime: 0, sortTime: 0, classifyTime: 0 }
    };
  }
};

// Download document
export const downloadDocument = async (id: string): Promise<any> => {
  try {
    window.open(`${API_BASE}/documents/${id}/download`, '_blank');
  } catch (error) {
    console.error('Error downloading document:', error);
    throw error;
  }
};

// Delete document
export const deleteDocument = async (id: string): Promise<any> => {
  try {
    const data = await apiCall(`/documents/${id}`, {
      method: 'DELETE',
    });
    return data;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};