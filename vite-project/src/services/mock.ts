// src/services/mockApi.ts
import { Document, SearchResult, ClassificationTree, Statistics } from '../types';

// Mock documents data
export const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Cloud Computing Architecture',
    filename: 'cloud_arch.pdf',
    fileType: 'pdf',
    fileSize: 2621440, // ~2.5 MB
    uploadDate: '2025-05-10T12:00:00Z',
    url: '#',
    classification: 'Technical Documents'
  },
  {
    id: '2',
    title: 'Advanced Machine Learning Techniques',
    filename: 'ml_techniques.pdf',
    fileType: 'pdf',
    fileSize: 462848, // ~450 KB
    uploadDate: '2025-05-15T09:30:00Z',
    url: '#',
    classification: 'Research Papers'
  },
  {
    id: '3',
    title: 'Financial Report 2024',
    filename: 'financial_2024.docx',
    fileType: 'docx',
    fileSize: 893952, // ~870 KB
    uploadDate: '2025-05-05T14:15:00Z',
    url: '#',
    classification: 'Financial Reports'
  }
];

// Mock classification tree
export const mockClassificationTree: ClassificationTree[] = [
  {
    id: 'academic',
    name: 'Academic Papers',
    children: []
  },
  {
    id: 'technical',
    name: 'Technical Documents',
    children: [
      {
        id: 'guides',
        name: 'Guides',
        children: []
      },
      {
        id: 'specs',
        name: 'Specifications',
        children: []
      }
    ]
  },
  {
    id: 'financial',
    name: 'Financial Reports',
    children: [
      {
        id: 'annual',
        name: 'Annual Reports',
        children: []
      },
      {
        id: 'quarterly',
        name: 'Quarterly Reports',
        children: []
      }
    ]
  }
];

// Mock statistics
export const mockStatistics: Statistics = {
  totalDocuments: 345,
  totalSize: 134217728, // ~128 MB
  averageSize: 387072, // ~378 KB
  documentTypes: {
    pdf: 224,
    docx: 104,
    doc: 17
  },
  performanceMetrics: {
    uploadTime: 245,
    searchTime: 125,
    sortTime: 56,
    classifyTime: 312
  }
};

// Mock search results
export const mockSearchResults = (query: string): SearchResult[] => {
  return [
    {
      documentId: '1',
      title: 'Cloud Computing Architecture',
      filename: 'cloud_arch.pdf',
      matches: [
        {
          text: `the principles of ${query} have revolutionized the way businesses approach infrastructure`,
          position: 120
        },
        {
          text: `discusses the benefits of ${query} for scalability and cost reduction in enterprise systems`,
          position: 450
        }
      ]
    },
    {
      documentId: '4',
      title: 'Future of Distributed Systems',
      filename: 'distributed_systems.pdf',
      matches: [
        {
          text: `modern ${query} paradigms offer significant advantages over traditional on-premises solutions`,
          position: 225
        }
      ]
    }
  ];
};