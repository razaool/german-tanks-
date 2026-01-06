/**
 * BayesianChart component - PDF curve visualization of posterior distribution.
 */

import React, { useMemo } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { BayesianResponse } from '../types/simulation';

interface BayesianChartProps {
  data: BayesianResponse | null;
}

export const BayesianChart: React.FC<BayesianChartProps> = ({ data }) => {
  // Transform data for Recharts
  const chartData = useMemo(() => {
    if (!data) return [];

    return data.n_values.map((n, i) => ({
      n: Math.round(n),
      probability: data.posterior[i]
    }));
  }, [data]);

  if (!data) {
    return (
      <div style={styles.container}>
        <div style={styles.placeholder}>Run a simulation to see Bayesian analysis</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Bayesian Posterior Distribution</h3>
      <p style={styles.subtitle}>
        Probability distribution of the population size N given observed data
      </p>

      <div style={styles.metrics}>
        <div style={styles.metric}>
          <div style={styles.metricLabel}>Observed Max (m)</div>
          <div style={styles.metricValue}>{data.max_observed}</div>
        </div>
        <div style={styles.metric}>
          <div style={styles.metricLabel}>MAP Estimate</div>
          <div style={styles.metricValue}>{Math.round(data.map_estimate)}</div>
        </div>
        <div style={styles.metric}>
          <div style={styles.metricLabel}>Mean Estimate</div>
          <div style={styles.metricValue}>{Math.round(data.mean_estimate)}</div>
        </div>
        <div style={styles.metric}>
          <div style={styles.metricLabel}>95% Credible Interval</div>
          <div style={styles.metricValue}>
            [{Math.round(data.credible_interval_95[0])}, {Math.round(data.credible_interval_95[1])}]
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={450}>
        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
          <defs>
            <linearGradient id="posteriorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis
            dataKey="n"
            label={{ value: 'Population Size (N)', position: 'insideBottom', offset: -10, fill: '#a0a0a0', style: { fontSize: '14px' } }}
            tick={{ fontSize: 12, fill: '#a0a0a0' }}
            stroke="#2a2a2a"
          />
          <YAxis
            label={{ value: 'Probability Density', angle: -90, position: 'insideLeft', fill: '#a0a0a0', style: { fontSize: '14px' } }}
            tick={{ fontSize: 12, fill: '#a0a0a0' }}
            stroke="#2a2a2a"
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #8b5cf6', borderRadius: '8px', color: '#ffffff' }}
            formatter={(value: number) => [value.toFixed(5), 'Probability']}
            labelFormatter={(label: number) => `N = ${label.toLocaleString()}`}
          />
          <Legend wrapperStyle={{ color: '#d0d0d0', paddingTop: '20px' }} />
          <ReferenceLine
            x={data.true_population}
            stroke="#ef4444"
            label={{ value: 'True N', position: 'top', fill: '#ef4444', fontSize: 13 }}
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          <ReferenceLine
            x={data.map_estimate}
            stroke="#8b5cf6"
            label={{ value: 'MAP', position: 'bottom', fill: '#8b5cf6', fontSize: 13 }}
            strokeWidth={2}
            strokeDasharray="3 3"
          />
          <Area
            type="monotone"
            dataKey="probability"
            stroke="#8b5cf6"
            fill="url(#posteriorGradient)"
            strokeWidth={3}
            name="Posterior Distribution"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div style={styles.insights}>
        <div style={styles.insight}>
          <strong style={{ color: '#8b5cf6' }}>Posterior Distribution:</strong>
          Shows the probability of different population sizes given the observed data.
        </div>
        <div style={styles.insight}>
          <strong style={{ color: '#8b5cf6' }}>MAP Estimate:</strong> {Math.round(data.map_estimate)} -
          The most likely value of N (peak of the distribution).
        </div>
        <div style={styles.insight}>
          <strong style={{ color: '#8b5cf6' }}>95% Credible Interval:</strong> [{Math.round(data.credible_interval_95[0])}, {Math.round(data.credible_interval_95[1])}] -
          We're 95% confident the true N lies in this range.
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
    border: '1px solid rgba(139, 92, 246, 0.15)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 40px rgba(139, 92, 246, 0.05)',
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
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.03), rgba(139, 92, 246, 0.02))',
    borderRadius: '12px',
    border: '1px dashed rgba(139, 92, 246, 0.2)',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
  metrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  } as React.CSSProperties,
  metric: {
    padding: '16px',
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(139, 92, 246, 0.05))',
    borderRadius: '12px',
    textAlign: 'center' as const,
    border: '1px solid rgba(139, 92, 246, 0.15)',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
  metricLabel: {
    fontSize: '11px',
    color: '#a0a0a0',
    marginBottom: '8px',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    fontWeight: '500',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
  metricValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#ffffff',
    textShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
  insights: {
    marginTop: '20px',
    padding: '20px',
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(139, 92, 246, 0.05))',
    borderRadius: '12px',
    border: '1px solid rgba(139, 92, 246, 0.15)',
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
