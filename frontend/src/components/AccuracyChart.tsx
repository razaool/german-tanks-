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
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis
            dataKey="sample_size"
            label={{ value: 'Sample Size (k)', position: 'insideBottom', offset: -10, fill: '#a0a0a0', style: { fontSize: '14px' } }}
            tick={{ fontSize: 12, fill: '#a0a0a0' }}
            stroke="#2a2a2a"
          />
          <YAxis
            label={{ value: 'RMSE', angle: -90, position: 'insideLeft', fill: '#a0a0a0', style: { fontSize: '14px' } }}
            tick={{ fontSize: 12, fill: '#a0a0a0' }}
            stroke="#2a2a2a"
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #3b82f6', borderRadius: '8px', color: '#ffffff' }}
            formatter={(value: number, name: string) => [
              value.toFixed(2),
              name === 'naive_rmse' ? 'Naive RMSE' : 'MVUE RMSE'
            ]}
            labelFormatter={(label: number) => `Sample Size: ${label}`}
          />
          <Legend wrapperStyle={{ color: '#d0d0d0' }} />
          <Line
            type="monotone"
            dataKey="naive_rmse"
            stroke="#3b82f6"
            name="Naive Estimator RMSE"
            strokeWidth={3}
            dot={{ r: 5, fill: '#3b82f6', strokeWidth: 2 }}
            activeDot={{ r: 7, fill: '#3b82f6', stroke: '#1a1a1a', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="mvue_rmse"
            stroke="#10b981"
            name="MVUE Estimator RMSE"
            strokeWidth={3}
            dot={{ r: 5, fill: '#10b981', strokeWidth: 2 }}
            activeDot={{ r: 7, fill: '#10b981', stroke: '#1a1a1a', strokeWidth: 2 }}
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
    background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.8), rgba(31, 31, 31, 0.8))',
    backdropFilter: 'blur(10px)',
    padding: '28px',
    borderRadius: '16px',
    marginBottom: '32px',
    border: '1px solid rgba(59, 130, 246, 0.15)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 40px rgba(59, 130, 246, 0.05)',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
  title: {
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#ffffff',
    letterSpacing: '-0.3px',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
  subtitle: {
    fontSize: '15px',
    color: '#a0a0a0',
    marginBottom: '20px',
    lineHeight: '1.5',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
  placeholder: {
    padding: '80px 40px',
    textAlign: 'center' as const,
    color: '#6b6b6b',
    fontSize: '17px',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.03), rgba(139, 92, 246, 0.02))',
    borderRadius: '12px',
    border: '1px dashed rgba(59, 130, 246, 0.2)',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
  insights: {
    marginTop: '20px',
    padding: '20px',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(139, 92, 246, 0.05))',
    borderRadius: '12px',
    border: '1px solid rgba(59, 130, 246, 0.15)',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
  insight: {
    marginBottom: '10px',
    fontSize: '15px',
    color: '#d0d0d0',
    lineHeight: '1.6',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
};
