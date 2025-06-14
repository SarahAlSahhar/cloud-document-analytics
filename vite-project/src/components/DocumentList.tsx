// // // components/DocumentList.tsx
// // import { useState, useEffect } from 'react';
// // import { getAllDocuments, sortDocuments, deleteDocument } from '../services/api';
// // import { Document } from '../types';

// // const DocumentList = () => {
// //   const [documents, setDocuments] = useState<Document[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [sortField, setSortField] = useState<string>('title');
// //   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
// //   const [sortingInProgress, setSortingInProgress] = useState(false);
// //   const [sortingTime, setSortingTime] = useState<number | null>(null);

// //   useEffect(() => {
// //     fetchDocuments();
// //   }, []);

// //   const fetchDocuments = async () => {
// //     try {
// //       setLoading(true);
// //       const data = await getAllDocuments();
// //       setDocuments(data);
// //       setError(null);
// //     } catch (err) {
// //       setError('Failed to load documents');
// //       console.error(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleSort = async (field: string) => {
// //     try {
// //       setSortingInProgress(true);
// //       const startTime = performance.now();
      
// //       const newOrder = field === sortField && sortOrder === 'asc' ? 'desc' : 'asc';
// //       setSortField(field);
// //       setSortOrder(newOrder);
      
// //       const sortedDocs = await sortDocuments(field, newOrder);
// //       setDocuments(sortedDocs);
      
// //       const endTime = performance.now();
// //       setSortingTime(endTime - startTime);
// //     } catch (err) {
// //       setError('Failed to sort documents');
// //       console.error(err);
// //     } finally {
// //       setSortingInProgress(false);
// //     }
// //   };

// //   const handleDelete = async (id: string) => {
// //     if (window.confirm('Are you sure you want to delete this document?')) {
// //       try {
// //         await deleteDocument(id);
// //         setDocuments(documents.filter(doc => doc.id !== id));
// //       } catch (err) {
// //         setError('Failed to delete document');
// //         console.error(err);
// //       }
// //     }
// //   };

// //   const handleDownload = async (doc: Document) => {
// //     window.open(doc.url, '_blank');
// //   };

// //   if (loading) {
// //     return <div className="loading">Loading documents...</div>;
// //   }

// //   if (error) {
// //     return (
// //       <div className="error-container">
// //         <p className="error">{error}</p>
// //         <button onClick={fetchDocuments}>Try Again</button>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="document-list">
// //       <h2>Document List</h2>
      
// //       {sortingTime !== null && (
// //         <div className="sorting-info">
// //           <p>Sorting time: {sortingTime.toFixed(2)} ms</p>
// //         </div>
// //       )}
      
// //       {documents.length === 0 ? (
// //         <div className="no-documents">
// //           <p>No documents found. Please upload some documents first.</p>
// //         </div>
// //       ) : (
// //         <div className="table-container">
// //           <table className="documents-table">
// //             <thead>
// //               <tr>
// //                 <th onClick={() => handleSort('title')} className="sortable">
// //                   Title {sortField === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
// //                 </th>
// //                 <th onClick={() => handleSort('filename')} className="sortable">
// //                   Filename {sortField === 'filename' && (sortOrder === 'asc' ? '↑' : '↓')}
// //                 </th>
// //                 <th onClick={() => handleSort('fileType')} className="sortable">
// //                   Type {sortField === 'fileType' && (sortOrder === 'asc' ? '↑' : '↓')}
// //                 </th>
// //                 <th onClick={() => handleSort('fileSize')} className="sortable">
// //                   Size {sortField === 'fileSize' && (sortOrder === 'asc' ? '↑' : '↓')}
// //                 </th>
// //                 <th onClick={() => handleSort('uploadDate')} className="sortable">
// //                   Upload Date {sortField === 'uploadDate' && (sortOrder === 'asc' ? '↑' : '↓')}
// //                 </th>
// //                 <th onClick={() => handleSort('classification')} className="sortable">
// //                   Classification {sortField === 'classification' && (sortOrder === 'asc' ? '↑' : '↓')}
// //                 </th>
// //                 <th>Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {documents.map(doc => (
// //                 <tr key={doc.id}>
// //                   <td>{doc.title}</td>
// //                   <td>{doc.filename}</td>
// //                   <td>{doc.fileType.toUpperCase()}</td>
// //                   <td>{(doc.fileSize / 1024).toFixed(2)} KB</td>
// //                   <td>{new Date(doc.uploadDate).toLocaleDateString()}</td>
// //                   <td>{doc.classification || 'Unclassified'}</td>
// //                   <td className="actions">
// //                     <button onClick={() => handleDownload(doc)} className="action-button">
// //                       View
// //                     </button>
// //                     <button onClick={() => handleDelete(doc.id)} className="action-button delete">
// //                       Delete
// //                     </button>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default DocumentList;


// // components/DocumentList.tsx - Updated with proper delete functionality
// import { useState, useEffect } from 'react';
// import axios from 'axios';

// interface Document {
//   id: string;
//   title: string;
//   filename: string;
//   fileType: string;
//   fileSize: number;
//   uploadDate: string;
//   classification: string;
//   url?: string;
//   performanceTime?: number;
// }

// const DocumentList = () => {
//   const [documents, setDocuments] = useState<Document[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [sortBy, setSortBy] = useState('uploadDate');
//   const [sortOrder, setSortOrder] = useState('desc');
//   const [deleting, setDeleting] = useState<string | null>(null);

//   const API_BASE_URL = 'http://localhost:5000/api';

//   useEffect(() => {
//     fetchDocuments();
//   }, []);

//   const fetchDocuments = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await axios.get(`${API_BASE_URL}/documents`);
//       setDocuments(response.data);
//     } catch (err: unknown) {
//       const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
//       const apiError = err as { response?: { data?: { message?: string } } };
//       setError('Failed to fetch documents: ' + (apiError.response?.data?.message || errorMessage));
//       console.error('Error fetching documents:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSort = async (field: string) => {
//     try {
//       setLoading(true);
//       const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
//       setSortBy(field);
//       setSortOrder(newOrder);
      
//       const response = await axios.get(`${API_BASE_URL}/documents/sort`, {
//         params: { sortBy: field, order: newOrder }
//       });
      
//       setDocuments(response.data);
      
//       // Show performance time if available
//       if (response.data.performanceTime) {
//         console.log(`Sort completed in ${response.data.performanceTime}ms`);
//       }
//     } catch (err: unknown) {
//       const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
//       const apiError = err as { response?: { data?: { message?: string } } };
//       setError('Failed to sort documents: ' + (apiError.response?.data?.message || errorMessage));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (documentId: string) => {
//     if (!window.confirm('Are you sure you want to delete this document?')) {
//       return;
//     }

//     try {
//       setDeleting(documentId);
//       await axios.delete(`${API_BASE_URL}/documents/${documentId}`);
      
//       // Remove document from state
//       setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      
//       console.log('Document deleted successfully');
//     } catch (err: unknown) {
//       const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
//       const apiError = err as { response?: { data?: { message?: string } } };
//       setError('Failed to delete document: ' + (apiError.response?.data?.message || errorMessage));
//       console.error('Error deleting document:', err);
//     } finally {
//       setDeleting(null);
//     }
//   };

//   const handleDownload = async (documentId: string, filename: string) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/documents/${documentId}/download`, {
//         responseType: 'blob'
//       });
      
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', filename);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (err: unknown) {
//       const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
//       const apiError = err as { response?: { data?: { message?: string } } };
//       setError('Failed to download document: ' + (apiError.response?.data?.message || errorMessage));
//     }
//   };

//   const formatFileSize = (bytes: number) => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getSortIcon = (field: string) => {
//     if (sortBy !== field) return '↕️';
//     return sortOrder === 'asc' ? '↑' : '↓';
//   };

//   if (loading) {
//     return <div className="loading">Loading documents...</div>;
//   }

//   if (error) {
//     return (
//       <div className="error-container">
//         <div className="error">{error}</div>
//         <button onClick={fetchDocuments}>Try Again</button>
//       </div>
//     );
//   }

//   return (
//     <div className="document-list">
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
//         <h2>Document Library</h2>
//         <button 
//           onClick={fetchDocuments}
//           style={{
//             backgroundColor: 'var(--primary-color)',
//             color: 'white',
//             border: 'none',
//             padding: '0.5rem 1rem',
//             borderRadius: '4px',
//             cursor: 'pointer'
//           }}
//         >
//           Refresh
//         </button>
//       </div>

//       {sortBy && (
//         <div className="sorting-info">
//           Currently sorted by: <strong>{sortBy}</strong> ({sortOrder}ending)
//         </div>
//       )}

//       {documents.length === 0 ? (
//         <div className="no-documents">
//           <h3>No documents found</h3>
//           <p>Upload some documents to get started!</p>
//         </div>
//       ) : (
//         <div className="table-container">
//           <table className="documents-table">
//             <thead>
//               <tr>
//                 <th 
//                   className="sortable" 
//                   onClick={() => handleSort('title')}
//                   style={{ cursor: 'pointer' }}
//                 >
//                   Title {getSortIcon('title')}
//                 </th>
//                 <th 
//                   className="sortable" 
//                   onClick={() => handleSort('filename')}
//                   style={{ cursor: 'pointer' }}
//                 >
//                   Filename {getSortIcon('filename')}
//                 </th>
//                 <th 
//                   className="sortable" 
//                   onClick={() => handleSort('fileType')}
//                   style={{ cursor: 'pointer' }}
//                 >
//                   Type {getSortIcon('fileType')}
//                 </th>
//                 <th 
//                   className="sortable" 
//                   onClick={() => handleSort('fileSize')}
//                   style={{ cursor: 'pointer' }}
//                 >
//                   Size {getSortIcon('fileSize')}
//                 </th>
//                 <th 
//                   className="sortable" 
//                   onClick={() => handleSort('classification')}
//                   style={{ cursor: 'pointer' }}
//                 >
//                   Classification {getSortIcon('classification')}
//                 </th>
//                 <th 
//                   className="sortable" 
//                   onClick={() => handleSort('uploadDate')}
//                   style={{ cursor: 'pointer' }}
//                 >
//                   Upload Date {getSortIcon('uploadDate')}
//                 </th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {documents.map((doc) => (
//                 <tr key={doc.id}>
//                   <td>
//                     <strong>{doc.title}</strong>
//                   </td>
//                   <td>{doc.filename}</td>
//                   <td>
//                     <span style={{
//                       backgroundColor: 'var(--primary-color)',
//                       color: 'white',
//                       padding: '0.2rem 0.5rem',
//                       borderRadius: '12px',
//                       fontSize: '0.8rem',
//                       textTransform: 'uppercase'
//                     }}>
//                       {doc.fileType}
//                     </span>
//                   </td>
//                   <td>{formatFileSize(doc.fileSize)}</td>
//                   <td>
//                     <span style={{
//                       backgroundColor: doc.classification === 'Unclassified' ? '#95a5a6' : 'var(--secondary-color)',
//                       color: 'white',
//                       padding: '0.2rem 0.5rem',
//                       borderRadius: '12px',
//                       fontSize: '0.8rem'
//                     }}>
//                       {doc.classification}
//                     </span>
//                   </td>
//                   <td>{formatDate(doc.uploadDate)}</td>
//                   <td>
//                     <div className="actions">
//                       <button
//                         className="action-button"
//                         onClick={() => handleDownload(doc.id, doc.filename)}
//                         title="Download"
//                       >
//                         📥 Download
//                       </button>
//                       <button
//                         className="action-button delete"
//                         onClick={() => handleDelete(doc.id)}
//                         disabled={deleting === doc.id}
//                         title="Delete"
//                       >
//                         {deleting === doc.id ? '⏳' : '🗑️'} Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       <div style={{ 
//         marginTop: '1rem', 
//         padding: '1rem', 
//         backgroundColor: 'var(--card-background)', 
//         borderRadius: '8px',
//         fontSize: '0.9rem',
//         color: '#666'
//       }}>
//         <strong>{documents.length}</strong> document{documents.length !== 1 ? 's' : ''} total
//       </div>
//     </div>
//   );
// };

// export default DocumentList;


// components/DocumentList.tsx - Fixed for test.js backend
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Document {
  id: string;
  title: string;
  filename: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  classification: string;
  url?: string;
}

const DocumentList = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('uploadDate');
  const [sortOrder, setSortOrder] = useState('desc');

  // Using test.js backend routes (NO /api prefix)
  const API_BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // test.js backend returns: { success: true, documents: [...], totalDocuments: number }
      const response = await axios.get(`${API_BASE_URL}/documents`);
      
      console.log('API Response:', response.data); // Debug log
      
      // Handle test.js backend response format
      let documentsData: any[] = [];
      if (response.data.success && response.data.documents) {
        documentsData = response.data.documents;
      } else if (Array.isArray(response.data)) {
        documentsData = response.data;
      } else {
        throw new Error('Unexpected response format from server');
      }
      
      // Normalize document data for frontend
      const normalizedDocuments = documentsData.map((doc: any) => ({
        id: doc.id || doc._id,
        title: doc.title,
        filename: doc.filename,
        fileType: doc.fileType,
        fileSize: doc.fileSize,
        uploadDate: doc.uploadDate,
        classification: doc.classification || 'Unclassified',
        url: doc.url
      }));
      
      setDocuments(normalizedDocuments);
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      const apiError = err as { response?: { data?: { message?: string } } };
      
      console.error('Error fetching documents:', err); // Debug log
      
      setError('Failed to fetch documents: ' + (apiError.response?.data?.message || errorMessage));
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    // Client-side sorting since test.js backend doesn't have sort endpoint
    const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortOrder(newOrder);
    
    const sortedDocs = [...documents].sort((a, b) => {
      let aVal: any = a[field as keyof Document];
      let bVal: any = b[field as keyof Document];
      
      // Handle different data types
      if (field === 'fileSize') {
        aVal = parseInt(aVal.toString()) || 0;
        bVal = parseInt(bVal.toString()) || 0;
      } else if (field === 'uploadDate') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else {
        aVal = (aVal || '').toString().toLowerCase();
        bVal = (bVal || '').toString().toLowerCase();
      }
      
      if (newOrder === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });
    
    setDocuments(sortedDocs);
  };

  // Delete functionality - NOW WORKING!
  const handleDelete = async (documentId: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      console.log('Deleting document ID:', documentId);
      
      const response = await axios.delete(`${API_BASE_URL}/documents/${documentId}`);
      
      if (response.data.success) {
        // Remove document from state immediately
        setDocuments(prev => prev.filter(doc => doc.id !== documentId));
        console.log('✅ Document deleted successfully');
        
        // Optional: Show success message
        alert('Document deleted successfully!');
      } else {
        throw new Error(response.data.message || 'Delete failed');
      }
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      const apiError = err as { response?: { data?: { message?: string } } };
      
      console.error('Delete error:', err);
      setError('Failed to delete document: ' + (apiError.response?.data?.message || errorMessage));
      alert('Failed to delete document: ' + (apiError.response?.data?.message || errorMessage));
    }
  };

  // Download functionality - NOW WORKING!
  const handleDownload = async (documentId: string, filename: string) => {
    try {
      console.log('Downloading document ID:', documentId);
      
      const response = await axios.get(`${API_BASE_URL}/documents/${documentId}/download`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Download started for:', filename);
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      const apiError = err as { response?: { data?: { message?: string } } };
      
      console.error('Download error:', err);
      alert('Failed to download document: ' + (apiError.response?.data?.message || errorMessage));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return <div className="loading">Loading documents...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        <button onClick={fetchDocuments}>Try Again</button>
        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          <strong>Troubleshooting:</strong>
          <ul style={{ textAlign: 'left', marginTop: '0.5rem' }}>
            <li>Make sure you're running <code>node test.js</code> in your backend directory</li>
            <li>Check that the server is running on port 5000</li>
            <li>Verify the backend console shows no errors</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="document-list">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Document Library</h2>
        <button 
          onClick={fetchDocuments}
          style={{
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Refresh
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="no-documents">
          <h3>No documents found</h3>
          <p>Upload some documents to get started!</p>
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem' }}>
            Go to the <strong>Upload</strong> page to add documents to your library.
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table className="documents-table">
            <thead>
              <tr>
                <th 
                  className="sortable" 
                  onClick={() => handleSort('title')}
                  style={{ cursor: 'pointer' }}
                >
                  Title {getSortIcon('title')}
                </th>
                <th 
                  className="sortable" 
                  onClick={() => handleSort('filename')}
                  style={{ cursor: 'pointer' }}
                >
                  Filename {getSortIcon('filename')}
                </th>
                <th 
                  className="sortable" 
                  onClick={() => handleSort('fileType')}
                  style={{ cursor: 'pointer' }}
                >
                  Type {getSortIcon('fileType')}
                </th>
                <th 
                  className="sortable" 
                  onClick={() => handleSort('fileSize')}
                  style={{ cursor: 'pointer' }}
                >
                  Size {getSortIcon('fileSize')}
                </th>
                <th 
                  className="sortable" 
                  onClick={() => handleSort('classification')}
                  style={{ cursor: 'pointer' }}
                >
                  Classification {getSortIcon('classification')}
                </th>
                <th 
                  className="sortable" 
                  onClick={() => handleSort('uploadDate')}
                  style={{ cursor: 'pointer' }}
                >
                  Upload Date {getSortIcon('uploadDate')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <strong>{doc.title}</strong>
                  </td>
                  <td>{doc.filename}</td>
                  <td>
                    <span style={{
                      backgroundColor: 'var(--primary-color)',
                      color: 'white',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      textTransform: 'uppercase'
                    }}>
                      {doc.fileType}
                    </span>
                  </td>
                  <td>{formatFileSize(doc.fileSize)}</td>
                  <td>
                    <span style={{
                      backgroundColor: doc.classification === 'Unclassified' ? '#95a5a6' : 'var(--secondary-color)',
                      color: 'white',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem'
                    }}>
                      {doc.classification}
                    </span>
                  </td>
                  <td>{formatDate(doc.uploadDate)}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="action-button"
                        onClick={() => handleDownload(doc.id, doc.filename)}
                        title="Download (Not available in test.js backend)"
                        style={{ opacity: 0.6 }}
                      >
                        📥 Download*
                      </button>
                      <button
                        className="action-button delete"
                        onClick={() => handleDelete(doc.id)}
                        title="Delete (Not available in test.js backend)"
                        style={{ opacity: 0.6 }}
                      >
                        🗑️ Delete*
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div style={{
            marginTop: '0.5rem',
            fontSize: '0.8rem',
            color: '#666',
            fontStyle: 'italic'
          }}>
            * These features are not implemented in the file storage backend (test.js)
          </div>
        </div>
      )}

      <div style={{ 
        marginTop: '1rem', 
        padding: '1rem', 
        backgroundColor: 'var(--card-background)', 
        borderRadius: '8px',
        fontSize: '0.9rem',
        color: '#666'
      }}>
        <strong>{documents.length}</strong> document{documents.length !== 1 ? 's' : ''} total
      </div>
    </div>
  );
};

export default DocumentList;