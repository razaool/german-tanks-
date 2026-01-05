/**
 * AccuracyChart component - line plot showing RMSE vs sample size.
 */

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { AccuracyResponse } from '../types/simulation';

interface AccuracyChartProps {
  data: AccuracyResponse | null;
}

export const AccuracyChart: React.FC<AccuracyChartProps> = ({ data }) => {
  if (!data) {
    return (
      <div style={styles.container}>
        <div style={styles.placeholder}>Run a simulation to see accuracy analysis</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Accuracy Analysis (RMSE vs Sample Size)</h3>
      <p style={styles.subtitle}>
        How estimator error decreases as you capture more tanks (Law of Large Numbers)
      </p>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data.results}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="sample_size"
            label={{ value: 'Sample Size (k)', position: 'insideBottom', offset: -10 }}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            label={{ value: 'RMSE', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              value.toFixed(2),
              name === 'naive_rmse' ? 'Naive RMSE' : 'MVUE RMSE'
            ]}
            labelFormatter={(label: number) => `Sample Size: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="naive_rmse"
            stroke="#3b82f6"
            name="Naive Estimator RMSE"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="mvue_rmse"
            stroke="#10b981"
            name="MVUE Estimator RMSE"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div style={styles.insights}>
        <div style={styles.insight}>
          The MVUE estimator (green) consistently achieves lower RMSE than the naive estimator (blue).
        </div>
        <div style={styles.insight}>
          As sample size increases, both estimators improve, but MVUE maintains its advantage.
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '8px',
    marginBottom: '24px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  } as React.CSSProperties,
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#333',
  } as React.CSSProperties,
  subtitle: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '16px',
  } as React.CSSProperties,
  placeholder: {
    padding: '60px',
    textAlign: 'center' as const,
    color: '#999',
    fontSize: '16px',
  } as React.CSSProperties,
  insights: {
    marginTop: '16px',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
  } as React.CSSProperties,
  insight: {
    marginBottom: '8px',
    fontSize: '14px',
    color: '#333',
  } as React.CSSProperties,
};
