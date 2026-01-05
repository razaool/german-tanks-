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
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="estimate"
            label={{ value: 'Estimated Number of Tanks', position: 'insideBottom', offset: -10 }}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number, name: string) => [value, name === 'naive_count' ? 'Naive' : 'MVUE']}
            labelFormatter={(label: number) => `Estimate: ${label.toLocaleString()}`}
          />
          <Legend />
          <ReferenceLine
            x={data.true_population}
            stroke="red"
            label={{ value: 'True N', position: 'top' }}
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          <Bar
            dataKey="naive_count"
            fill="#3b82f6"
            name="Naive Estimator"
            opacity={0.7}
          />
          <Bar
            dataKey="mvue_count"
            fill="#10b981"
            name="MVUE Estimator"
            opacity={0.7}
          />
        </BarChart>
      </ResponsiveContainer>
      <div style={styles.insights}>
        <div style={styles.insight}>
          <strong style={{ color: '#3b82f6' }}>Naive Estimator:</strong>
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
