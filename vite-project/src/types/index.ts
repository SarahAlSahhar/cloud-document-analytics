// types/index.ts
export interface Document {
    id: string;
    title: string;
    filename: string;
    fileType: 'pdf' | 'docx' | 'doc';
    fileSize: number;
    uploadDate: string;
    url: string;
    classification?: string;
  }
  
  export interface SearchResult {
    documentId: string;
    title: string;
    filename: string;
    matches: {
      text: string;
      position: number;
    }[];
  }
  
  export interface ClassificationTree {
    id: string;
    name: string;
    children?: ClassificationTree[];
  }
  
  export interface Statistics {
    totalDocuments: number;
    totalSize: number;
    averageSize: number;
    documentTypes: {
      pdf: number;
      docx: number;
      doc: number;
    };
    performanceMetrics: {
      uploadTime: number;
      searchTime: number;
      sortTime: number;
      classifyTime: number;
    };
  }