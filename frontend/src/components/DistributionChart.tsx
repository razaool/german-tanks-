/**
 * DistributionChart component - histogram visualization of estimate distributions.
 */

import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer
} from 'recharts';
import { bin } from 'd3-array';
import { SimulationResponse } from '../types/simulation';

interface DistributionChartProps {
  data: SimulationResponse | null;
}

export const DistributionChart: React.FC<DistributionChartProps> = ({ data }) => {
  const histogramData = useMemo(() => {
    if (!data) return [];

    // Create histogram bins using d3-array
    const allValues = [...data.naive_estimates, ...data.mvue_estimates];

    const bins = bin()
      .domain([
        Math.min(...allValues),
        Math.max(...allValues)
      ])
      .thresholds(50);

    const binnedData = bins(allValues);

    // Count naive and MVUE estimates in each bin
    return binnedData.map((bin) => {
      const binCenter = Math.round((bin.x0! + bin.x1!) / 2);

      // Count how many naive and MVUE estimates fall in this bin
      const naiveCount = data.naive_estimates.filter(
        val => val >= bin.x0! && val < bin.x1!
      ).length;

      const mvueCount = data.mvue_estimates.filter(
        val => val >= bin.x0! && val < bin.x1!
      ).length;

      return {
        estimate: binCenter,
        naive_count: naiveCount,
        mvue_count: mvueCount
      };
    });
  }, [data]);

  if (!data) {
    return (
      <div style={styles.container}>
        <div style={styles.placeholder}>Run a simulation to see distribution</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Distribution of Estimates</h3>
      <p style={styles.subtitle}>
        Comparing Naive (blue) vs MVUE (green) estimators across 10,000 simulations
      </p>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={histogramData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis
            dataKey="estimate"
            label={{ value: 'Estimated Number of Tanks', position: 'insideBottom', offset: -10, fill: '#a0a0a0', style: { fontSize: '14px' } }}
            tick={{ fontSize: 12, fill: '#a0a0a0' }}
            stroke="#2a2a2a"
          />
          <YAxis
            label={{ value: 'Frequency', angle: -90, position: 'insideLeft', fill: '#a0a0a0', style: { fontSize: '14px' } }}
            tick={{ fontSize: 12, fill: '#a0a0a0' }}
            stroke="#2a2a2a"
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #10b981', borderRadius: '8px', color: '#ffffff' }}
            formatter={(value: number, name: string) => [value, name === 'naive_count' ? 'Naive' : 'MVUE']}
            labelFormatter={(label: number) => `Estimate: ${label.toLocaleString()}`}
          />
          <Legend wrapperStyle={{ color: '#d0d0d0' }} />
          <ReferenceLine
            x={data.true_population}
            stroke="#ef4444"
            label={{ value: 'True N', position: 'top', fill: '#ef4444', fontSize: 13 }}
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          <Bar
            dataKey="naive_count"
            fill="url(#naiveGradient)"
            name="Naive Estimator"
            opacity={0.8}
          />
          <Bar
            dataKey="mvue_count"
            fill="url(#mvueGradient)"
            name="MVUE Estimator"
            opacity={0.8}
          />
          <defs>
            <linearGradient id="naiveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.9}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.6}/>
            </linearGradient>
            <linearGradient id="mvueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.6}/>
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
      <div style={styles.insights}>
        <div style={styles.insight}>
          <strong style={{ color: '#06b6d4' }}>Naive Estimator:</strong>
          Biased low (underestimates) - Mean: {(data.true_population + data.naive_bias).toLocaleString()}
        </div>
        <div style={styles.insight}>
          <strong style={{ color: '#10b981' }}>MVUE Estimator:</strong>
          Unbiased - Mean: {(data.true_population + data.mvue_bias).toLocaleString()}
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
    border: '1px solid rgba(16, 185, 129, 0.15)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 40px rgba(16, 185, 129, 0.05)',
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
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.03), rgba(6, 182, 212, 0.02))',
    borderRadius: '12px',
    border: '1px dashed rgba(16, 185, 129, 0.2)',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
  insights: {
    marginTop: '20px',
    padding: '20px',
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(6, 182, 212, 0.05))',
    borderRadius: '12px',
    border: '1px solid rgba(16, 185, 129, 0.15)',
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
