// // components/DocumentClassifier.tsx
// import { useState, useEffect } from 'react';
// import { getAllDocuments, getClassificationTree, classifyDocument } from '../services/api';
// import { Document, ClassificationTree as ClassificationTreeType } from '../types';

// const ClassificationNode = ({ 
//   node, 
//   selectedClassification, 
//   onSelect 
// }: { 
//   node: ClassificationTreeType; 
//   selectedClassification: string | null;
//   onSelect: (id: string) => void;
// }) => {
//   const [expanded, setExpanded] = useState(false);
  
//   const hasChildren = node.children && node.children.length > 0;
  
//   return (
//     <li className="classification-node">
//       <div 
//         className={`node-content ${selectedClassification === node.id ? 'selected' : ''}`}
//         onClick={() => onSelect(node.id)}
//       >
//         {hasChildren && (
//           <button 
//             className="expand-button"
//             onClick={(e) => {
//               e.stopPropagation();
//               setExpanded(!expanded);
//             }}
//           >
//             {expanded ? '▼' : '►'}
//           </button>
//         )}
//         <span className="node-name">{node.name}</span>
//       </div>
      
//       {hasChildren && expanded && (
//         <ul className="node-children">
//           {node.children.map(child => (
//             <ClassificationNode
//               key={child.id}
//               node={child}
//               selectedClassification={selectedClassification}
//               onSelect={onSelect}
//             />
//           ))}
//         </ul>
//       )}
//     </li>
//   );
// };

// const DocumentClassifier = () => {
//   const [documents, setDocuments] = useState<Document[]>([]);
//   const [classificationTree, setClassificationTree] = useState<ClassificationTreeType[]>([]);
//   const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
//   const [selectedClassification, setSelectedClassification] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [classifying, setClassifying] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [classificationTime, setClassificationTime] = useState<number | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         const [docsData, classData] = await Promise.all([
//           getAllDocuments(),
//           getClassificationTree()
//         ]);
        
//         setDocuments(docsData);
//         setClassificationTree(classData);
//         setError(null);
//       } catch (err) {
//         setError('Failed to load data');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchData();
//   }, []);

//   const handleClassify = async () => {
//     if (!selectedDocument || !selectedClassification) return;
    
//     try {
//       setClassifying(true);
//       setSuccessMessage(null);
      
//       const startTime = performance.now();
//       await classifyDocument(selectedDocument, selectedClassification);
//       const endTime = performance.now();
      
//       setClassificationTime(endTime - startTime);
      
//       // Update the document in the local state
//       setDocuments(prevDocs => 
//         prevDocs.map(doc => {
//           if (doc.id === selectedDocument) {
//             const selectedClass = findClassificationName(classificationTree, selectedClassification);
//             return { ...doc, classification: selectedClass };
//           }
//           return doc;
//         })
//       );
      
//       setSuccessMessage('Document classified successfully!');
//     } catch (err) {
//       setError('Failed to classify document');
//       console.error(err);
//     } finally {
//       setClassifying(false);
//     }
//   };

//   const findClassificationName = (tree: ClassificationTreeType[], id: string): string => {
//     for (const node of tree) {
//       if (node.id === id) return node.name;
      
//       if (node.children && node.children.length > 0) {
//         const found = findClassificationName(node.children, id);
//         if (found) return found;
//       }
//     }
    
//     return 'Unknown';
//   };

//   if (loading) {
//     return <div className="loading">Loading classifier...</div>;
//   }

//   if (error) {
//     return (
//       <div className="error-container">
//         <p className="error">{error}</p>
//         <button onClick={() => window.location.reload()}>Try Again</button>
//       </div>
//     );
//   }

//   return (
//     <div className="document-classifier">
//       <h2>Document Classifier</h2>
      
//       <div className="classifier-container">
//         <div className="document-selection">
//           <h3>Select Document</h3>
          
//           {documents.length === 0 ? (
//             <p className="no-documents">No documents available for classification. Please upload some documents first.</p>
//           ) : (
//             <div className="documents-dropdown">
//               <select
//                 value={selectedDocument || ''}
//                 onChange={(e) => setSelectedDocument(e.target.value || null)}
//               >
//                 <option value="">-- Select a document --</option>
//                 {documents.map(doc => (
//                   <option key={doc.id} value={doc.id}>
//                     {doc.title} ({doc.filename})
//                     </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
        
//         <div className="classification-selection">
//           <h3>Select Classification</h3>
          
//           {classificationTree.length === 0 ? (
//             <p className="no-classifications">No classification categories available.</p>
//           ) : (
//             <div className="classification-tree">
//               <ul className="tree-root">
//                 {classificationTree.map(node => (
//                   <ClassificationNode
//                     key={node.id}
//                     node={node}
//                     selectedClassification={selectedClassification}
//                     onSelect={setSelectedClassification}
//                   />
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>
      
//       <div className="classification-actions">
//         <button
//           className="classify-button"
//           onClick={handleClassify}
//           disabled={!selectedDocument || !selectedClassification || classifying}
//         >
//           {classifying ? 'Classifying...' : 'Classify Document'}
//         </button>
//       </div>
      
//       {classificationTime !== null && (
//         <div className="classification-info">
//           <p>Classification completed in {classificationTime.toFixed(2)} ms</p>
//         </div>
//       )}
      
//       {successMessage && (
//         <div className="success-message">
//           <p>{successMessage}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DocumentClassifier;



// // components/DocumentClassifier.tsx - Updated with auto-classify functionality
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { API_URLS } from '../config/api';

// interface Document {
//   id: string;
//   title: string;
//   filename: string;
//   classification: string;
// }

// interface Classification {
//   id: string;
//   name: string;
//   keywords?: string[];
// }

// const DocumentClassifier = () => {
//   const [documents, setDocuments] = useState<Document[]>([]);
//   const [classifications, setClassifications] = useState<Classification[]>([]);
//   const [selectedDocument, setSelectedDocument] = useState<string>('');
//   const [selectedClassification, setSelectedClassification] = useState<string>('');
//   const [loading, setLoading] = useState(true);
//   const [classifying, setClassifying] = useState(false);
//   const [autoClassifying, setAutoClassifying] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const [docsResponse, classResponse] = await Promise.all([
//         axios.get(API_URLS.getAllDocuments()),
//         axios.get(API_URLS.getClassifications())
//       ]);
      
//       // Handle different response formats
//       let documentsData = Array.isArray(docsResponse.data) ? docsResponse.data : docsResponse.data.documents || [];
//       let classificationsData = Array.isArray(classResponse.data) ? classResponse.data : classResponse.data.classifications || [];
      
//       // Normalize document data
//       const normalizedDocuments = documentsData.map((doc: any) => ({
//         id: doc.id || doc._id,
//         title: doc.title,
//         filename: doc.filename,
//         classification: doc.classification || 'Unclassified'
//       }));
      
//       setDocuments(normalizedDocuments);
//       setClassifications(classificationsData);
//     } catch (err: unknown) {
//       const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
//       const apiError = err as { response?: { data?: { message?: string } } };
//       setError('Failed to load data: ' + (apiError.response?.data?.message || errorMessage));
//       console.error('Error fetching data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClassifyDocument = async () => {
//     if (!selectedDocument || !selectedClassification) {
//       setError('Please select both a document and a classification');
//       return;
//     }

//     try {
//       setClassifying(true);
//       setError(null);
//       setSuccessMessage(null);

//       // Note: Manual classification not available in test.js backend
//       // This would require implementing individual document classification
//       setSuccessMessage('Manual classification not available in file storage mode. Use auto-classify instead.');
//       console.log('Manual classification attempted - not supported in test.js backend');
//     } catch (err: unknown) {
//       const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
//       const apiError = err as { response?: { data?: { message?: string } } };
//       setError('Failed to classify document: ' + (apiError.response?.data?.message || errorMessage));
//       console.error('Error classifying document:', err);
//     } finally {
//       setClassifying(false);
//     }
//   };

//   const handleAutoClassifyAll = async () => {
//     if (!window.confirm('This will automatically classify all unclassified documents. Continue?')) {
//       return;
//     }

//     try {
//       setAutoClassifying(true);
//       setError(null);
//       setSuccessMessage(null);

//       // Initialize classifications first
//       await axios.get(API_URLS.initClassifications());
      
//       // Then refresh documents to get updated classifications
//       await fetchData();

//       setSuccessMessage(
//         `Auto-classification completed! Please check the Documents page to see the updated classifications.`
//       );
//     } catch (err: unknown) {
//       const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
//       const apiError = err as { response?: { data?: { message?: string } } };
//       setError('Failed to auto-classify documents: ' + (apiError.response?.data?.message || errorMessage));
//       console.error('Error auto-classifying documents:', err);
//     } finally {
//       setAutoClassifying(false);
//     }
//   };

//   const getUnclassifiedCount = () => {
//     return documents.filter(doc => 
//       doc.classification === 'Unclassified' || !doc.classification
//     ).length;
//   };

//   const selectedDoc = documents.find(doc => doc.id === selectedDocument);
//   const selectedClass = classifications.find(cls => cls.id === selectedClassification);

//   if (loading) {
//     return <div className="loading">Loading classifier...</div>;
//   }

//   return (
//     <div className="document-classifier">
//       <h2>Document Classifier</h2>
      
//       {error && <div className="error">{error}</div>}
//       {successMessage && <div className="success-message">{successMessage}</div>}

//       {/* Auto-classify section */}
//       <div style={{
//         backgroundColor: 'var(--card-background)',
//         borderRadius: '8px',
//         padding: '1.5rem',
//         marginBottom: '2rem',
//         boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
//       }}>
//         <h3>Automatic Classification</h3>
//         <p>
//           Automatically classify documents based on content analysis and keywords. 
//           Currently <strong>{getUnclassifiedCount()}</strong> document{getUnclassifiedCount() !== 1 ? 's' : ''} unclassified.
//         </p>
//         <button
//           onClick={handleAutoClassifyAll}
//           disabled={autoClassifying || getUnclassifiedCount() === 0}
//           style={{
//             backgroundColor: 'var(--secondary-color)',
//             color: 'white',
//             border: 'none',
//             padding: '0.75rem 1.5rem',
//             borderRadius: '4px',
//             cursor: autoClassifying || getUnclassifiedCount() === 0 ? 'not-allowed' : 'pointer',
//             fontWeight: '500',
//             fontSize: '1rem',
//             opacity: autoClassifying || getUnclassifiedCount() === 0 ? 0.6 : 1
//           }}
//         >
//           {autoClassifying ? '🔄 Auto-Classifying...' : '🤖 Auto-Classify All Documents'}
//         </button>
//       </div>

//       {/* Manual classification section */}
//       <div className="classifier-container">
//         <div className="document-selection">
//           <h3>Select Document</h3>
//           <div className="documents-dropdown">
//             <select
//               value={selectedDocument}
//               onChange={(e) => setSelectedDocument(e.target.value)}
//               disabled={classifying}
//             >
//               <option value="">Choose a document...</option>
//               {documents.map((doc) => (
//                 <option key={doc.id} value={doc.id}>
//                   {doc.title} ({doc.classification})
//                 </option>
//               ))}
//             </select>
//           </div>
          
//           {selectedDoc && (
//             <div style={{
//               marginTop: '1rem',
//               padding: '1rem',
//               backgroundColor: 'rgba(52, 152, 219, 0.1)',
//               borderRadius: '4px'
//             }}>
//               <strong>Selected:</strong> {selectedDoc.title}<br />
//               <strong>Current Classification:</strong> {selectedDoc.classification}
//             </div>
//           )}
//         </div>

//         <div className="classification-selection">
//           <h3>Select Classification</h3>
//           <div className="classification-tree">
//             <div className="tree-root">
//               {classifications.map((classification) => (
//                 <div
//                   key={classification.id}
//                   className={`classification-node ${
//                     selectedClassification === classification.id ? 'selected' : ''
//                   }`}
//                 >
//                   <div
//                     className="node-content"
//                     onClick={() => setSelectedClassification(classification.id)}
//                   >
//                     <span className="node-name">{classification.name}</span>
//                   </div>
//                   {classification.keywords && classification.keywords.length > 0 && (
//                     <div style={{
//                       fontSize: '0.8rem',
//                       color: '#666',
//                       marginTop: '0.25rem',
//                       marginLeft: '1rem'
//                     }}>
//                       Keywords: {classification.keywords.join(', ')}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {selectedClass && (
//             <div style={{
//               marginTop: '1rem',
//               padding: '1rem',
//               backgroundColor: 'rgba(46, 204, 113, 0.1)',
//               borderRadius: '4px'
//             }}>
//               <strong>Selected:</strong> {selectedClass.name}
//               {selectedClass.keywords && (
//                 <>
//                   <br />
//                   <strong>Keywords:</strong> {selectedClass.keywords.join(', ')}
//                 </>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Manual classification action */}
//       <div className="classification-actions">
//         <button
//           className="classify-button"
//           onClick={handleClassifyDocument}
//           disabled={!selectedDocument || !selectedClassification || classifying}
//         >
//           {classifying ? '⏳ Classifying...' : '🏷️ Classify Document'}
//         </button>
//       </div>

//       {/* Statistics */}
//       <div style={{
//         marginTop: '2rem',
//         padding: '1rem',
//         backgroundColor: 'var(--card-background)',
//         borderRadius: '8px',
//         boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
//       }}>
//         <h4>Classification Statistics</h4>
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
//           <div>
//             <strong>Total Documents:</strong> {documents.length}
//           </div>
//           <div>
//             <strong>Unclassified:</strong> {getUnclassifiedCount()}
//           </div>
//           <div>
//             <strong>Classified:</strong> {documents.length - getUnclassifiedCount()}
//           </div>
//           <div>
//             <strong>Available Categories:</strong> {classifications.length}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DocumentClassifier;




// components/DocumentClassifier.tsx - Fixed for File Storage with Manual Classification
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Document {
  id: string;
  title: string;
  filename: string;
  classification: string;
}

interface Classification {
  id: string;
  name: string;
  keywords?: string[];
}

const DocumentClassifier = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<string>('');
  const [selectedClassification, setSelectedClassification] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [classifying, setClassifying] = useState(false);
  const [autoClassifying, setAutoClassifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Using test.js backend (NO /api prefix)
  const API_BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [docsResponse, classResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/documents`),
        axios.get(`${API_BASE_URL}/classifications`)
      ]);
      
      console.log('Documents response:', docsResponse.data);
      console.log('Classifications response:', classResponse.data);
      
      // Handle test.js backend response format
      let documentsData = [];
      if (docsResponse.data.success && docsResponse.data.documents) {
        documentsData = docsResponse.data.documents;
      } else if (Array.isArray(docsResponse.data)) {
        documentsData = docsResponse.data;
      }
      
      let classificationsData = [];
      if (classResponse.data.success && classResponse.data.classifications) {
        classificationsData = classResponse.data.classifications;
      } else if (Array.isArray(classResponse.data)) {
        classificationsData = classResponse.data;
      }
      
      // Normalize document data
      const normalizedDocuments = documentsData.map((doc: any) => ({
        id: doc.id || doc._id,
        title: doc.title,
        filename: doc.filename,
        classification: doc.classification || 'Unclassified'
      }));
      
      setDocuments(normalizedDocuments);
      setClassifications(classificationsData);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      const apiError = err as { response?: { data?: { message?: string } } };
      setError('Failed to load data: ' + (apiError.response?.data?.message || errorMessage));
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // MANUAL CLASSIFICATION - NOW WORKING!
  const handleClassifyDocument = async () => {
    if (!selectedDocument || !selectedClassification) {
      setError('Please select both a document and a classification');
      return;
    }

    try {
      setClassifying(true);
      setError(null);
      setSuccessMessage(null);

      console.log(`Classifying document ${selectedDocument} as ${selectedClassification}`);

      const response = await axios.post(
        `${API_BASE_URL}/classifications/${selectedDocument}/classify`,
        { classificationId: selectedClassification }
      );

      if (response.data.success) {
        // Update documents list
        setDocuments(prev => prev.map(doc => 
          doc.id === selectedDocument 
            ? { ...doc, classification: response.data.classificationName }
            : doc
        ));

        setSuccessMessage(`✅ Document successfully classified as "${response.data.classificationName}"`);
        
        // Clear selections
        setSelectedDocument('');
        setSelectedClassification('');
        
        console.log('Manual classification successful:', response.data);
      } else {
        throw new Error(response.data.message || 'Classification failed');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      const apiError = err as { response?: { data?: { message?: string } } };
      setError('Failed to classify document: ' + (apiError.response?.data?.message || errorMessage));
      console.error('Error classifying document:', err);
    } finally {
      setClassifying(false);
    }
  };

  const handleAutoClassifyAll = async () => {
    if (!window.confirm('This will automatically classify all unclassified documents. Continue?')) {
      return;
    }

    try {
      setAutoClassifying(true);
      setError(null);
      setSuccessMessage(null);

      // Initialize classifications first
      await axios.get(`${API_BASE_URL}/init-classifications`);
      
      // Then run auto-classification
      const response = await axios.post(`${API_BASE_URL}/classifications/auto-classify`);
      
      if (response.data.success) {
        // Refresh documents to get updated classifications
        await fetchData();

        setSuccessMessage(
          `🤖 Auto-classification completed! ${response.data.classified} documents were classified.`
        );
      } else {
        throw new Error(response.data.message || 'Auto-classification failed');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      const apiError = err as { response?: { data?: { message?: string } } };
      setError('Failed to auto-classify documents: ' + (apiError.response?.data?.message || errorMessage));
      console.error('Error auto-classifying documents:', err);
    } finally {
      setAutoClassifying(false);
    }
  };

  const getUnclassifiedCount = () => {
    return documents.filter(doc => 
      doc.classification === 'Unclassified' || !doc.classification
    ).length;
  };

  const selectedDoc = documents.find(doc => doc.id === selectedDocument);
  const selectedClass = classifications.find(cls => cls.id === selectedClassification);

  if (loading) {
    return <div className="loading">Loading classifier...</div>;
  }

  return (
    <div className="document-classifier">
      <h2>Document Classifier</h2>
      
      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {/* Auto-classify section */}
      <div style={{
        backgroundColor: 'var(--card-background)',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <h3>🤖 Automatic Classification</h3>
        <p>
          Automatically classify documents based on content analysis and keywords. 
          Currently <strong>{getUnclassifiedCount()}</strong> document{getUnclassifiedCount() !== 1 ? 's' : ''} unclassified.
        </p>
        <button
          onClick={handleAutoClassifyAll}
          disabled={autoClassifying || getUnclassifiedCount() === 0}
          style={{
            backgroundColor: 'var(--secondary-color)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            cursor: autoClassifying || getUnclassifiedCount() === 0 ? 'not-allowed' : 'pointer',
            fontWeight: '500',
            fontSize: '1rem',
            opacity: autoClassifying || getUnclassifiedCount() === 0 ? 0.6 : 1
          }}
        >
          {autoClassifying ? '🔄 Auto-Classifying...' : '🤖 Auto-Classify All Documents'}
        </button>
      </div>

      {/* Manual classification section */}
      <div style={{
        backgroundColor: 'var(--card-background)',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <h3>🏷️ Manual Classification</h3>
        <p>Manually classify individual documents by selecting a document and classification category.</p>
        
        <div className="classifier-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1rem' }}>
          <div className="document-selection">
            <h4>1. Select Document</h4>
            <div className="documents-dropdown">
              <select
                value={selectedDocument}
                onChange={(e) => setSelectedDocument(e.target.value)}
                disabled={classifying}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '1rem'
                }}
              >
                <option value="">Choose a document...</option>
                {documents.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.title} ({doc.classification})
                  </option>
                ))}
              </select>
            </div>
            
            {selectedDoc && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderRadius: '4px'
              }}>
                <strong>Selected:</strong> {selectedDoc.title}<br />
                <strong>Current Classification:</strong> {selectedDoc.classification}
              </div>
            )}
          </div>

          <div className="classification-selection">
            <h4>2. Select New Classification</h4>
            <div className="classification-grid" style={{ display: 'grid', gap: '0.5rem' }}>
              {classifications.map((classification) => (
                <div
                  key={classification.id}
                  className={`classification-option ${
                    selectedClassification === classification.id ? 'selected' : ''
                  }`}
                  style={{
                    padding: '0.75rem',
                    border: `2px solid ${selectedClassification === classification.id ? 'var(--primary-color)' : '#ddd'}`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    backgroundColor: selectedClassification === classification.id ? 'rgba(52, 152, 219, 0.1)' : 'white',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setSelectedClassification(classification.id)}
                >
                  <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>
                    {classification.name}
                  </div>
                  {classification.keywords && classification.keywords.length > 0 && (
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#666',
                      marginTop: '0.25rem'
                    }}>
                      Keywords: {classification.keywords.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {selectedClass && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                borderRadius: '4px'
              }}>
                <strong>Selected:</strong> {selectedClass.name}
                {selectedClass.keywords && (
                  <>
                    <br />
                    <strong>Keywords:</strong> {selectedClass.keywords.join(', ')}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Manual classification action */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button
            onClick={handleClassifyDocument}
            disabled={!selectedDocument || !selectedClassification || classifying}
            style={{
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '4px',
              cursor: (!selectedDocument || !selectedClassification || classifying) ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              fontSize: '1rem',
              opacity: (!selectedDocument || !selectedClassification || classifying) ? 0.6 : 1
            }}
          >
            {classifying ? '⏳ Classifying...' : '🏷️ Classify Document'}
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: 'var(--card-background)',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <h4>📊 Classification Statistics</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <strong>Total Documents:</strong> {documents.length}
          </div>
          <div>
            <strong>Unclassified:</strong> {getUnclassifiedCount()}
          </div>
          <div>
            <strong>Classified:</strong> {documents.length - getUnclassifiedCount()}
          </div>
          <div>
            <strong>Available Categories:</strong> {classifications.length}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        borderRadius: '8px',
        fontSize: '0.9rem'
      }}>
        <h4>ℹ️ How to Use:</h4>
        <ol style={{ marginLeft: '1rem' }}>
          <li><strong>Auto-Classification:</strong> Click "Auto-Classify All Documents" to automatically categorize all unclassified documents based on keywords.</li>
          <li><strong>Manual Classification:</strong> Select a document, choose a classification category, then click "Classify Document".</li>
          <li><strong>View Results:</strong> Check the Documents page to see the updated classifications.</li>
        </ol>
      </div>
    </div>
  );
};

export default DocumentClassifier;