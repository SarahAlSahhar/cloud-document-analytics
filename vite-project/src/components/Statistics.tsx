// components/Statistics.tsx
import { useState, useEffect } from 'react';
import { getStatistics } from '../services/api';
import { Statistics as StatsType } from '../types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Statistics = () => {
  const [statistics, setStatistics] = useState<StatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const data = await getStatistics();
        setStatistics(data);
        setError(null);
      } catch (err) {
        setError('Failed to load statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return <div className="loading">Loading statistics...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error">{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  if (!statistics) {
    return <div>No statistics available</div>;
  }

  const documentTypeData = [
    { name: 'PDF', value: statistics.documentTypes.pdf },
    { name: 'DOCX', value: statistics.documentTypes.docx },
    { name: 'DOC', value: statistics.documentTypes.doc },
  ];

  const performanceData = [
    { name: 'Upload', time: statistics.performanceMetrics.uploadTime },
    { name: 'Search', time: statistics.performanceMetrics.searchTime },
    { name: 'Sort', time: statistics.performanceMetrics.sortTime },
    { name: 'Classify', time: statistics.performanceMetrics.classifyTime },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="statistics">
      <h2>System Statistics</h2>
      
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Documents</h3>
          <div className="stat-value">{statistics.totalDocuments}</div>
          <div className="stat-label">Total Documents</div>
        </div>
        
        <div className="stat-card">
          <h3>Storage</h3>
          <div className="stat-value">{(statistics.totalSize / (1024 * 1024)).toFixed(2)} MB</div>
          <div className="stat-label">Total Size</div>
        </div>
        
        <div className="stat-card">
          <h3>Average</h3>
          <div className="stat-value">{(statistics.averageSize / 1024).toFixed(2)} KB</div>
          <div className="stat-label">Per Document</div>
        </div>
      </div>
      
      <div className="stats-charts">
        <div className="chart-container">
          <h3>Document Types Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={documentTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {documentTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-container">
          <h3>Performance Metrics (milliseconds)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={performanceData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="time" fill="#82ca9d" name="Processing Time (ms)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="detailed-stats">
        <h3>Detailed Performance Metrics</h3>
        <table className="stats-table">
          <thead>
            <tr>
              <th>Operation</th>
              <th>Average Time (ms)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Document Upload</td>
              <td>{statistics.performanceMetrics.uploadTime.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Document Search</td>
              <td>{statistics.performanceMetrics.searchTime.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Document Sorting</td>
              <td>{statistics.performanceMetrics.sortTime.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Document Classification</td>
              <td>{statistics.performanceMetrics.classifyTime.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Statistics;