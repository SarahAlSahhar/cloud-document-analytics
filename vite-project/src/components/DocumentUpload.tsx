// // // components/DocumentUpload.tsx
// // import { useState } from 'react';
// // import { uploadDocument } from '../services/api';

// // const DocumentUpload = () => {
// //   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
// //   const [uploading, setUploading] = useState(false);
// //   const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
// //   const [uploadResults, setUploadResults] = useState<Record<string, { success: boolean; message: string }>>({});

// //   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     if (e.target.files) {
// //       const fileList = Array.from(e.target.files);
// //       const validFiles = fileList.filter(file => {
// //         const fileType = file.name.split('.').pop()?.toLowerCase();
// //         return fileType === 'pdf' || fileType === 'doc' || fileType === 'docx';
// //       });
      
// //       setSelectedFiles(prevFiles => [...prevFiles, ...validFiles]);
// //     }
// //   };

// //   const handleRemoveFile = (index: number) => {
// //     setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
// //   };

// //   const handleUpload = async () => {
// //     if (selectedFiles.length === 0) return;
    
// //     setUploading(true);
    
// //     const newUploadResults: Record<string, { success: boolean; message: string }> = {};
    
// //     for (const file of selectedFiles) {
// //       try {
// //         await uploadDocument(file, (progress) => {
// //           setUploadProgress(prev => ({
// //             ...prev,
// //             [file.name]: progress
// //           }));
// //         });
        
// //         newUploadResults[file.name] = {
// //           success: true,
// //           message: 'File uploaded successfully'
// //         };
// //       } catch (error) {
// //         console.error(`Error uploading ${file.name}:`, error);
// //         newUploadResults[file.name] = {
// //           success: false,
// //           message: 'Upload failed'
// //         };
// //       }
// //     }
    
// //     setUploadResults(newUploadResults);
// //     setUploading(false);
// //     setSelectedFiles([]);
// //     setUploadProgress({});
// //   };

// //   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
// //     e.preventDefault();
// //   };

// //   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
// //     e.preventDefault();
    
// //     if (e.dataTransfer.files) {
// //       const fileList = Array.from(e.dataTransfer.files);
// //       const validFiles = fileList.filter(file => {
// //         const fileType = file.name.split('.').pop()?.toLowerCase();
// //         return fileType === 'pdf' || fileType === 'doc' || fileType === 'docx';
// //       });
      
// //       setSelectedFiles(prevFiles => [...prevFiles, ...validFiles]);
// //     }
// //   };

// //   return (
// //     <div className="document-upload">
// //       <h2>Upload Documents</h2>
      
// //       <div 
// //         className="upload-area"
// //         onDragOver={handleDragOver}
// //         onDrop={handleDrop}
// //       >
// //         <div className="upload-prompt">
// //           <i className="upload-icon">📁</i>
// //           <p>Drag and drop PDF or Word documents here</p>
// //           <p>OR</p>
// //           <label className="upload-button">
// //             Browse Files
// //             <input 
// //               type="file" 
// //               multiple 
// //               accept=".pdf,.doc,.docx" 
// //               onChange={handleFileChange} 
// //               style={{ display: 'none' }}
// //             />
// //           </label>
// //         </div>
// //       </div>
      
// //       {selectedFiles.length > 0 && (
// //         <div className="selected-files">
// //           <h3>Selected Files</h3>
// //           <ul className="file-list">
// //             {selectedFiles.map((file, index) => (
// //               <li key={index} className="file-item">
// //                 <div className="file-info">
// //                   <span className="file-name">{file.name}</span>
// //                   <span className="file-size">{(file.size / 1024).toFixed(2)} KB</span>
// //                 </div>
// //                 {uploadProgress[file.name] !== undefined && (
// //                   <div className="progress-bar">
// //                     <div 
// //                       className="progress" 
// //                       style={{ width: `${uploadProgress[file.name]}%` }}
// //                     />
// //                   </div>
// //                 )}
// //                 <button 
// //                   className="remove-file" 
// //                   onClick={() => handleRemoveFile(index)}
// //                   disabled={uploading}
// //                 >
// //                   ✖
// //                 </button>
// //               </li>
// //             ))}
// //           </ul>
          
// //           <button 
// //             className="upload-submit" 
// //             onClick={handleUpload}
// //             disabled={uploading}
// //           >
// //             {uploading ? 'Uploading...' : 'Upload All Files'}
// //           </button>
// //         </div>
// //       )}
      
// //       {Object.keys(uploadResults).length > 0 && (
// //         <div className="upload-results">
// //           <h3>Upload Results</h3>
// //           <ul className="results-list">
// //             {Object.entries(uploadResults).map(([filename, result]) => (
// //               <li 
// //                 key={filename} 
// //                 className={`result-item ${result.success ? 'success' : 'error'}`}
// //               >
// //                 <span className="result-filename">{filename}</span>
// //                 <span className="result-message">{result.message}</span>
// //               </li>
// //             ))}
// //           </ul>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default DocumentUpload;


// // components/DocumentUpload.tsx - REPLACE YOUR CURRENT DocumentUpload.tsx
// import { useState } from 'react';
// import { uploadDocument, initializeClassifications } from '../services/api';

// const DocumentUpload = () => {
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
//   const [uploadResults, setUploadResults] = useState<Record<string, { success: boolean; message: string }>>({});
//   const [initializing, setInitializing] = useState(false);
//   const [initMessage, setInitMessage] = useState<string>('');

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const fileList = Array.from(e.target.files);
//       const validFiles = fileList.filter(file => {
//         const fileType = file.name.split('.').pop()?.toLowerCase();
//         return fileType === 'pdf' || fileType === 'doc' || fileType === 'docx';
//       });
      
//       setSelectedFiles(prevFiles => [...prevFiles, ...validFiles]);
//     }
//   };

//   const handleRemoveFile = (index: number) => {
//     setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
//   };

//   const handleInitializeClassifications = async () => {
//     try {
//       setInitializing(true);
//       setInitMessage('Initializing classifications...');
      
//       const result = await initializeClassifications();
      
//       if (result.success) {
//         setInitMessage('✅ Classifications initialized successfully!');
//       } else {
//         setInitMessage('❌ Failed to initialize classifications');
//       }
//     } catch (error) {
//       setInitMessage('❌ Error initializing classifications');
//       console.error('Init error:', error);
//     } finally {
//       setInitializing(false);
//       // Clear message after 3 seconds
//       setTimeout(() => setInitMessage(''), 3000);
//     }
//   };

//   const handleUpload = async () => {
//     if (selectedFiles.length === 0) return;
    
//     setUploading(true);
    
//     const newUploadResults: Record<string, { success: boolean; message: string }> = {};
    
//     for (const file of selectedFiles) {
//       try {
//         const result = await uploadDocument(file, (progress) => {
//           setUploadProgress(prev => ({
//             ...prev,
//             [file.name]: progress
//           }));
//         });
        
//         newUploadResults[file.name] = {
//           success: result.success || false,
//           message: result.message || 'File uploaded successfully'
//         };
//       } catch (error) {
//         console.error(`Error uploading ${file.name}:`, error);
//         newUploadResults[file.name] = {
//           success: false,
//           message: 'Upload failed'
//         };
//       }
//     }
    
//     setUploadResults(newUploadResults);
//     setUploading(false);
//     setSelectedFiles([]);
//     setUploadProgress({});
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
    
//     if (e.dataTransfer.files) {
//       const fileList = Array.from(e.dataTransfer.files);
//       const validFiles = fileList.filter(file => {
//         const fileType = file.name.split('.').pop()?.toLowerCase();
//         return fileType === 'pdf' || fileType === 'doc' || fileType === 'docx';
//       });
      
//       setSelectedFiles(prevFiles => [...prevFiles, ...validFiles]);
//     }
//   };

//   return (
//     <div className="document-upload">
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
//         <h2>Upload Documents</h2>
//         <button 
//           onClick={handleInitializeClassifications}
//           disabled={initializing}
//           className="upload-button"
//           style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
//         >
//           {initializing ? 'Initializing...' : 'Initialize Classifications'}
//         </button>
//       </div>
      
//       {initMessage && (
//         <div className={`init-message ${initMessage.includes('✅') ? 'success' : 'error'}`} style={{
//           padding: '0.75rem',
//           marginBottom: '1rem',
//           borderRadius: '4px',
//           backgroundColor: initMessage.includes('✅') ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
//           color: initMessage.includes('✅') ? '#27ae60' : '#e74c3c'
//         }}>
//           {initMessage}
//         </div>
//       )}
      
//       <div 
//         className="upload-area"
//         onDragOver={handleDragOver}
//         onDrop={handleDrop}
//       >
//         <div className="upload-prompt">
//           <i className="upload-icon">📁</i>
//           <p>Drag and drop PDF or Word documents here</p>
//           <p>OR</p>
//           <label className="upload-button">
//             Browse Files
//             <input 
//               type="file" 
//               multiple 
//               accept=".pdf,.doc,.docx" 
//               onChange={handleFileChange} 
//               style={{ display: 'none' }}
//             />
//           </label>
//         </div>
//       </div>
      
//       {selectedFiles.length > 0 && (
//         <div className="selected-files">
//           <h3>Selected Files</h3>
//           <ul className="file-list">
//             {selectedFiles.map((file, index) => (
//               <li key={index} className="file-item">
//                 <div className="file-info">
//                   <span className="file-name">{file.name}</span>
//                   <span className="file-size">{(file.size / 1024).toFixed(2)} KB</span>
//                 </div>
//                 {uploadProgress[file.name] !== undefined && (
//                   <div className="progress-bar">
//                     <div 
//                       className="progress" 
//                       style={{ width: `${uploadProgress[file.name]}%` }}
//                     />
//                   </div>
//                 )}
//                 <button 
//                   className="remove-file" 
//                   onClick={() => handleRemoveFile(index)}
//                   disabled={uploading}
//                 >
//                   ✖
//                 </button>
//               </li>
//             ))}
//           </ul>
          
//           <button 
//             className="upload-submit" 
//             onClick={handleUpload}
//             disabled={uploading}
//           >
//             {uploading ? 'Uploading...' : 'Upload All Files'}
//           </button>
//         </div>
//       )}
      
//       {Object.keys(uploadResults).length > 0 && (
//         <div className="upload-results">
//           <h3>Upload Results</h3>
//           <ul className="results-list">
//             {Object.entries(uploadResults).map(([filename, result]) => (
//               <li 
//                 key={filename} 
//                 className={`result-item ${result.success ? 'success' : 'error'}`}
//               >
//                 <span className="result-filename">{filename}</span>
//                 <span className="result-message">{result.message}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DocumentUpload;


// components/DocumentUpload.tsx - Upload component with TypeScript
import { useState, useRef } from 'react';
import axios from 'axios';
import { API_URLS } from '../config/api';

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

interface UploadResult {
  success: boolean;
  message: string;
  document?: {
    id: string;
    title: string;
    filename: string;
    fileType: string;
    fileSize: number;
    classification: string;
  };
  performanceTime?: number;
}

const DocumentUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: UploadFile[] = Array.from(files).map(file => ({
      file,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: 'pending'
    }));

    // Validate file types
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    const validFiles = newFiles.filter(fileItem => {
      if (!validTypes.includes(fileItem.file.type)) {
        fileItem.status = 'error';
        fileItem.error = 'Invalid file type. Only PDF, DOCX, and DOC files are supported.';
        return true; // Keep to show error
      }
      if (fileItem.file.size > 10 * 1024 * 1024) { // 10MB
        fileItem.status = 'error';
        fileItem.error = 'File too large. Maximum size is 10MB.';
        return true; // Keep to show error
      }
      return true;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (fileId: string): void => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uploadFiles = async (): Promise<void> => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadResults([]);

    const validFiles = selectedFiles.filter(f => f.status !== 'error');

    for (const fileItem of validFiles) {
      try {
        // Update file status
        setSelectedFiles(prev => prev.map(f => 
          f.id === fileItem.id ? { ...f, status: 'uploading', progress: 0 } : f
        ));

        const formData = new FormData();
        formData.append('document', fileItem.file);

        const startTime = Date.now();
        const response = await axios.post<UploadResult>(API_URLS.uploadDocument(), formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent: any) => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setSelectedFiles(prev => prev.map(f => 
                f.id === fileItem.id ? { ...f, progress } : f
              ));
            }
          },
        });
        const endTime = Date.now();

        // Update file status to success
        setSelectedFiles(prev => prev.map(f => 
          f.id === fileItem.id ? { ...f, status: 'success', progress: 100 } : f
        ));

        // Add result
        const uploadTime = response.data.performanceTime || (endTime - startTime);
        setUploadResults(prev => [...prev, {
          ...response.data,
          performanceTime: uploadTime
        }]);

        console.log(`Upload completed in ${uploadTime}ms`);

      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        const apiError = err as { response?: { data?: { message?: string } } };
        const finalError = apiError.response?.data?.message || errorMessage;

        // Update file status to error
        setSelectedFiles(prev => prev.map(f => 
          f.id === fileItem.id ? { ...f, status: 'error', error: finalError } : f
        ));

        // Add error result
        setUploadResults(prev => [...prev, {
          success: false,
          message: finalError
        }]);

        console.error('Upload error:', err);
      }
    }

    setUploading(false);
  };

  const clearAll = (): void => {
    setSelectedFiles([]);
    setUploadResults([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStatusIcon = (status: UploadFile['status']): string => {
    switch (status) {
      case 'pending': return '📄';
      case 'uploading': return '⏳';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '📄';
    }
  };

  const getStatusColor = (status: UploadFile['status']): string => {
    switch (status) {
      case 'pending': return '#3498db';
      case 'uploading': return '#f39c12';
      case 'success': return '#2ecc71';
      case 'error': return '#e74c3c';
      default: return '#3498db';
    }
  };

  return (
    <div className="document-upload">
      <h2>Upload Documents</h2>
      
      <div className="upload-area">
        <div className="upload-prompt">
          <div className="upload-icon">📁</div>
          <h3>Upload your documents</h3>
          <p>Supported formats: PDF, DOCX, DOC (Max 10MB each)</p>
          <label className="upload-button">
            Choose Files
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.doc"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="selected-files">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Selected Files ({selectedFiles.length})</h3>
            <button
              onClick={clearAll}
              disabled={uploading}
              style={{
                backgroundColor: '#95a5a6',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: uploading ? 'not-allowed' : 'pointer',
                opacity: uploading ? 0.6 : 1
              }}
            >
              Clear All
            </button>
          </div>
          
          <ul className="file-list">
            {selectedFiles.map((fileItem) => (
              <li key={fileItem.id} className="file-item">
                <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>
                  {getStatusIcon(fileItem.status)}
                </span>
                <div className="file-info">
                  <div>
                    <span className="file-name">{fileItem.file.name}</span>
                    <span className="file-size"> ({formatFileSize(fileItem.file.size)})</span>
                  </div>
                  <div style={{ color: getStatusColor(fileItem.status), fontSize: '0.9rem' }}>
                    {fileItem.status === 'uploading' && `${fileItem.progress}%`}
                    {fileItem.status === 'error' && fileItem.error}
                    {fileItem.status === 'success' && 'Upload complete'}
                    {fileItem.status === 'pending' && 'Ready to upload'}
                  </div>
                </div>
                
                {fileItem.status === 'uploading' && (
                  <div className="progress-bar">
                    <div 
                      className="progress" 
                      style={{ width: `${fileItem.progress}%` }}
                    />
                  </div>
                )}
                
                {!uploading && fileItem.status !== 'success' && (
                  <button
                    className="remove-file"
                    onClick={() => removeFile(fileItem.id)}
                    title="Remove file"
                  >
                    ✕
                  </button>
                )}
              </li>
            ))}
          </ul>

          <button
            className="upload-submit"
            onClick={uploadFiles}
            disabled={uploading || selectedFiles.filter(f => f.status !== 'error').length === 0}
          >
            {uploading ? '⏳ Uploading...' : '📤 Upload Files'}
          </button>
        </div>
      )}

      {uploadResults.length > 0 && (
        <div className="upload-results">
          <h3>Upload Results</h3>
          <ul className="results-list">
            {uploadResults.map((result, index) => (
              <li
                key={index}
                className={`result-item ${result.success ? 'success' : 'error'}`}
              >
                <div>
                  <strong>{result.success ? '✅' : '❌'}</strong> {result.message}
                  {result.performanceTime && (
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                      Completed in {result.performanceTime}ms
                    </div>
                  )}
                </div>
                {result.document && (
                  <div style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    <strong>Title:</strong> {result.document.title} • 
                    <strong> Classification:</strong> {result.document.classification}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: 'var(--card-background)',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <h4>📋 Upload Guidelines</h4>
        <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
          <li>Supported formats: PDF, DOCX, DOC</li>
          <li>Maximum file size: 10MB per file</li>
          <li>Documents will be automatically processed for text extraction</li>
          <li>Classification can be done manually or automatically after upload</li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentUpload;