// App.tsx
import { Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import DocumentUpload from './components/DocumentUpload';
import DocumentList from './components/DocumentList';
import DocumentSearch from './components/DocumentSearch';
import DocumentClassifier from './components/DocumentClassifier';
import Statistics from './components/Statistics';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Cloud Document Analytics</h1>
        <nav className="main-nav">
          <Link to="/">Dashboard</Link>
          <Link to="/upload">Upload</Link>
          <Link to="/documents">Documents</Link>
          <Link to="/search">Search</Link>
          <Link to="/classify">Classify</Link>
          <Link to="/statistics">Statistics</Link>
        </nav>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<DocumentUpload />} />
          <Route path="/documents" element={<DocumentList />} />
          <Route path="/search" element={<DocumentSearch />} />
          <Route path="/classify" element={<DocumentClassifier />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;