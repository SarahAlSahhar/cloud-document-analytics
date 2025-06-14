// // components/DocumentSearch.tsx
// import { useState } from 'react';
// import { searchDocuments } from '../services/api';
// import { SearchResult } from '../types';

// const DocumentSearch = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTime, setSearchTime] = useState<number | null>(null);
//   const [hasSearched, setHasSearched] = useState(false);

//   const handleSearch = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!searchQuery.trim()) return;
    
//     try {
//       setLoading(true);
//       setHasSearched(true);
      
//       const startTime = performance.now();
//       const results = await searchDocuments(searchQuery);
//       const endTime = performance.now();
      
//       setSearchResults(results);
//       setSearchTime(endTime - startTime);
//       setError(null);
//     } catch (err) {
//       setError('Failed to search documents');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewDocument = (documentId: string) => {
//     // This would typically open the document in a viewer with the search terms highlighted
//     // For now, we'll just log the action
//     console.log(`Viewing document ${documentId} with search terms highlighted`);
//     window.open(`/document-viewer/${documentId}?highlight=${encodeURIComponent(searchQuery)}`, '_blank');
//   };
  
//   const highlightMatch = (text: string) => {
//     if (!searchQuery) return text;
    
//     const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
//     const parts = text.split(regex);
    
//     return parts.map((part, index) => 
//       regex.test(part) ? <mark key={index}>{part}</mark> : part
//     );
//   };
  
//   return (
//     <div className="document-search">
//       <h2>Search Documents</h2>
      
//       <form onSubmit={handleSearch} className="search-form">
//         <div className="search-input-container">
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Enter keywords to search for..."
//             className="search-input"
//           />
//           <button type="submit" className="search-button" disabled={loading}>
//             {loading ? 'Searching...' : 'Search'}
//           </button>
//         </div>
//       </form>
      
//       {searchTime !== null && (
//         <div className="search-info">
//           <p>Search completed in {searchTime.toFixed(2)} ms</p>
//         </div>
//       )}
      
//       {hasSearched && (
//         <div className="search-results">
//           <h3>Search Results</h3>
          
//           {error && <p className="error">{error}</p>}
          
//           {!error && searchResults.length === 0 && (
//             <p className="no-results">No documents found matching your search criteria.</p>
//           )}
          
//           {searchResults.length > 0 && (
//             <ul className="results-list">
//               {searchResults.map((result) => (
//                 <li key={result.documentId} className="result-item">
//                   <div className="result-header">
//                     <h4 className="result-title">{result.title}</h4>
//                     <span className="result-filename">{result.filename}</span>
//                   </div>
                  
//                   <div className="result-matches">
//                     {result.matches.map((match, index) => (
//                       <div key={index} className="match-snippet">
//                         <p>...{highlightMatch(match.text)}...</p>
//                       </div>
//                     ))}
//                   </div>
                  
//                   <button 
//                     onClick={() => handleViewDocument(result.documentId)}
//                     className="view-document"
//                   >
//                     View Document
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DocumentSearch;

// components/DocumentSearch.tsx - Updated with performance tracking
import { useState } from 'react';
import axios from 'axios';
import { API_URLS } from '../config/api';

interface SearchMatch {
  term: string;
  text: string;
  position: number;
  context: string;
  matchedText: string;
}

interface SearchResult {
  documentId: string;
  title: string;
  filename: string;
  classification: string;
  matches: SearchMatch[];
}

const DocumentSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTime, setSearchTime] = useState<number | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSearchTime(null);
      
      const startTime = Date.now();
      const response = await axios.get(API_URLS.searchDocuments(), {
        params: { query: searchQuery.trim() }
      });
      const endTime = Date.now();
      
      // Handle different response formats
      let searchData = Array.isArray(response.data) ? response.data : response.data.results || [];
      
      // Normalize search results for test.js backend
      const normalizedResults = searchData.map((result: any) => ({
        documentId: result.id || result._id || result.documentId,
        title: result.title,
        filename: result.filename,
        classification: result.classification || 'Unclassified',
        matches: result.matches || [{
          text: result.snippet || 'Match found in document content',
          position: 0,
          context: result.snippet || '',
          matchedText: searchQuery,
          term: searchQuery
        }]
      }));
      
      setSearchResults(normalizedResults);
      setHasSearched(true);
      
      // Track search time
      const clientTime = endTime - startTime;
      setSearchTime(response.data.performanceTime || clientTime);
      
      console.log(`Search completed in ${response.data.performanceTime || clientTime}ms`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      const apiError = err as { response?: { data?: { message?: string } } };
      setError('Search failed: ' + (apiError.response?.data?.message || errorMessage));
      console.error('Error searching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const highlightSearchTerms = (text: string) => {
    if (!searchQuery.trim()) return text;
    
    const terms = searchQuery.trim().split(/\s+/);
    let highlightedText = text;
    
    terms.forEach(term => {
      const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, `<mark>$&</mark>`);
    });
    
    return highlightedText;
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
    setSearchTime(null);
    setHasSearched(false);
  };

  return (
    <div className="document-search">
      <h2>Document Search</h2>
      
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            className="search-input"
            placeholder="Enter keywords to search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="search-button"
            disabled={loading || !searchQuery.trim()}
          >
            {loading ? '🔍 Searching...' : '🔍 Search'}
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              style={{
                backgroundColor: '#95a5a6',
                color: 'white',
                border: 'none',
                padding: '0 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                marginLeft: '0.5rem'
              }}
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {error && <div className="error">{error}</div>}
      
      {searchTime && (
        <div style={{
          padding: '0.5rem',
          backgroundColor: 'rgba(46, 204, 113, 0.1)',
          borderRadius: '4px',
          margin: '1rem 0',
          color: 'var(--secondary-color)',
          fontSize: '0.9rem'
        }}>
          ⚡ Search completed in {searchTime}ms
        </div>
      )}

      {hasSearched && (
        <div className="search-info">
          {searchResults.length > 0 ? (
            <>
              Found <strong>{searchResults.length}</strong> document{searchResults.length !== 1 ? 's' : ''} 
              {' '}containing "<strong>{searchQuery}</strong>"
            </>
          ) : (
            <>No documents found for "<strong>{searchQuery}</strong>"</>
          )}
        </div>
      )}

      <div className="search-results">
        {searchResults.length === 0 && hasSearched && !loading ? (
          <div className="no-results">
            <h3>No results found</h3>
            <p>Try different keywords or check your spelling.</p>
            <ul style={{ textAlign: 'left', marginTop: '1rem' }}>
              <li>Use more general terms</li>
              <li>Try synonyms or related words</li>
              <li>Check for typos</li>
              <li>Use fewer keywords</li>
            </ul>
          </div>
        ) : (
          <div className="results-list">
            {searchResults.map((result, index) => (
              <div key={`${result.documentId}-${index}`} className="result-item">
                <div className="result-header">
                  <h3 className="result-title">{result.title}</h3>
                  <div className="result-filename">
                    📄 {result.filename} • 
                    <span style={{
                      backgroundColor: result.classification === 'Unclassified' ? '#95a5a6' : 'var(--secondary-color)',
                      color: 'white',
                      padding: '0.1rem 0.5rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      marginLeft: '0.5rem'
                    }}>
                      {result.classification}
                    </span>
                  </div>
                </div>
                
                {result.matches && result.matches.length > 0 && (
                  <div className="result-matches">
                    <h4>Matches found ({result.matches.length}):</h4>
                    {result.matches.slice(0, 3).map((match, matchIndex) => (
                      <div key={matchIndex} className="match-snippet">
                        <div 
                          dangerouslySetInnerHTML={{ 
                            __html: highlightSearchTerms(match.text) 
                          }} 
                        />
                        {match.position && (
                          <div style={{ 
                            fontSize: '0.8rem', 
                            color: '#666', 
                            marginTop: '0.25rem' 
                          }}>
                            Position: {match.position}
                          </div>
                        )}
                      </div>
                    ))}
                    {result.matches.length > 3 && (
                      <div style={{ 
                        fontSize: '0.9rem', 
                        color: '#666', 
                        fontStyle: 'italic',
                        marginTop: '0.5rem'
                      }}>
                        ... and {result.matches.length - 3} more match{result.matches.length - 3 !== 1 ? 'es' : ''}
                      </div>
                    )}
                  </div>
                )}
                
                <div style={{ marginTop: '1rem' }}>
                  <button
                    className="view-document"
                    onClick={() => {
                      // Here you could implement document viewing functionality
                      console.log('View document:', result.documentId);
                      alert(`Document viewing not implemented yet. Document ID: ${result.documentId}`);
                    }}
                  >
                    📖 View Document
                  </button>
                  
                  <button
                    style={{
                      backgroundColor: 'var(--secondary-color)',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginLeft: '0.5rem'
                    }}
                    onClick={async () => {
                      try {
                        // Note: Download not available in test.js backend
                        alert('Download functionality not available in file storage mode');
                      } catch (downloadErr: unknown) {
                        const errorMessage = downloadErr instanceof Error ? downloadErr.message : 'Unknown error occurred';
                        const apiError = downloadErr as { response?: { data?: { message?: string } } };
                        console.error('Download failed:', downloadErr);
                        alert('Download failed: ' + (apiError.response?.data?.message || errorMessage));
                      }
                    }}
                  >
                    📥 Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search Tips */}
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: 'var(--card-background)',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <h4>💡 Search Tips</h4>
        <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
          <li>Use multiple keywords for better results</li>
          <li>Search is case-insensitive</li>
          <li>Results show content snippets with highlighted matches</li>
          <li>Search includes document titles and content</li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentSearch;