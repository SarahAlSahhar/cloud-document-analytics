// components/Dashboard.tsx
import { useState, useEffect } from 'react';
import { getStatistics } from '../services/api';
import { Statistics } from '../types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
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
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
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
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      <div className="stats-overview">
        <div className="stat-card">
          <h3>Total Documents</h3>
          <p className="stat-value">{statistics.totalDocuments}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Size</h3>
          <p className="stat-value">{(statistics.totalSize / (1024 * 1024)).toFixed(2)} MB</p>
        </div>
        
        <div className="stat-card">
          <h3>Average Size</h3>
          <p className="stat-value">{(statistics.averageSize / 1024).toFixed(2)} KB</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-wrapper">
          <h3>Document Types</h3>
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

        <div className="chart-wrapper">
          <h3>Performance Metrics (ms)</h3>
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
              <Bar dataKey="time" fill="#82ca9d" name="Time (ms)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;