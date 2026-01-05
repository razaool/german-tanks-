/**
 * Main App component - German Tank Problem visualization.
 */

import React, { useState } from 'react';
import { SimulationControls } from './components/SimulationControls';
import { DistributionChart } from './components/DistributionChart';
import { AccuracyChart } from './components/AccuracyChart';
import { simulationService } from './services/api';
import { SimulationResponse, AccuracyResponse } from './types/simulation';

function App() {
  const [simulationData, setSimulationData] = useState<SimulationResponse | null>(null);
  const [accuracyData, setAccuracyData] = useState<AccuracyResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = async (truePopulation: number, sampleSize: number) => {
    setIsLoading(true);
    setError(null);

    try {
      // Run main simulation
      const simResult = await simulationService.runSimulation({
        true_population: truePopulation,
        sample_size: sampleSize
      });
      setSimulationData(simResult);

      // Generate accuracy analysis across multiple sample sizes
      // Create a range from 5 to max(sample_size * 2, 100)
      const minSample = 5;
      const maxSample = Math.max(sampleSize * 2, 100);
      const numPoints = 10;
      const step = Math.floor((maxSample - minSample) / (numPoints - 1));

      const sampleSizes = Array.from(
        { length: numPoints },
        (_, i) => minSample + i * step
      );

      const accuracyResult = await simulationService.getAccuracyAnalysis({
        true_population: truePopulation,
        sample_sizes: sampleSizes
      });
      setAccuracyData(accuracyResult);

    } catch (err) {
      console.error('Simulation failed:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Simulation failed. Please check that the backend is running.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.title}>German Tank Problem</h1>
        <p style={styles.subtitle}>
          Statistical Estimation - Comparing Naive vs MVUE Estimators
        </p>
        <p style={styles.description}>
          During WWII, Allied statisticians estimated German tank production by analyzing
          serial numbers from captured tanks. The statistical estimate (246 tanks/month)
          was remarkably accurate compared to intelligence estimates (1,000-1,400 tanks/month).
          This simulation demonstrates why the mathematical approach worked.
        </p>
      </header>

      <main style={styles.main}>
        <SimulationControls onSimulate={handleSimulate} isLoading={isLoading} />

        {error && (
          <div style={styles.error}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {simulationData && (
          <>
            <div style={styles.metrics}>
              <h3 style={styles.metricsTitle}>Performance Metrics</h3>
              <div style={styles.metricsGrid}>
                <div style={styles.metric}>
                  <div style={styles.metricLabel}>True Population (N)</div>
                  <div style={styles.metricValue}>{simulationData.true_population.toLocaleString()}</div>
                </div>
                <div style={styles.metric}>
                  <div style={styles.metricLabel}>Sample Size (k)</div>
                  <div style={styles.metricValue}>{simulationData.sample_size}</div>
                </div>
                <div style={styles.metric}>
                  <div style={styles.metricLabel}>Iterations</div>
                  <div style={styles.metricValue}>{simulationData.metadata.iterations.toLocaleString()}</div>
                </div>
                <div style={styles.metric}>
                  <div style={styles.metricLabel}>Computation Time</div>
                  <div style={styles.metricValue}>{simulationData.metadata.computation_time_ms}ms</div>
                </div>
                <div style={styles.metric}>
                  <div style={{...styles.metricLabel, color: '#3b82f6'}}>Naive RMSE</div>
                  <div style={styles.metricValue}>{simulationData.naive_rmse}</div>
                </div>
                <div style={styles.metric}>
                  <div style={{...styles.metricLabel, color: '#10b981'}}>MVUE RMSE</div>
                  <div style={styles.metricValue}>{simulationData.mvue_rmse}</div>
                </div>
              </div>
            </div>

            <DistributionChart data={simulationData} />
          </>
        )}

        {accuracyData && <AccuracyChart data={accuracyData} />}
      </main>

      <footer style={styles.footer}>
        <p>
          <strong>The Math:</strong> Naive: N̂ = m (biased) | MVUE: N̂ = m(1 + 1/k) - 1 (unbiased)
        </p>
      </footer>
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0d0d0d 100%)',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
    border: 'none',
    margin: 0,
    padding: 0,
  } as React.CSSProperties,
  header: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    color: 'white',
    padding: '48px 24px',
    textAlign: 'center' as const,
    borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
  title: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '12px',
    margin: 0,
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.5px',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
  subtitle: {
    fontSize: '20px',
    marginBottom: '20px',
    opacity: 0.95,
    margin: 0,
    color: '#a0a0a0',
    fontWeight: '400',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
  description: {
    fontSize: '15px',
    maxWidth: '800px',
    margin: '20px auto 0',
    lineHeight: '1.7',
    opacity: 0.85,
    color: '#d0d0d0',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 24px',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
  metrics: {
    background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.8), rgba(31, 31, 31, 0.8))',
    backdropFilter: 'blur(10px)',
    padding: '28px',
    borderRadius: '16px',
    marginBottom: '32px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 40px rgba(59, 130, 246, 0.05)',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
  metricsTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#ffffff',
    letterSpacing: '-0.3px',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '20px',
  } as React.CSSProperties,
  metric: {
    padding: '20px',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(139, 92, 246, 0.05))',
    borderRadius: '12px',
    textAlign: 'center' as const,
    border: '1px solid rgba(59, 130, 246, 0.15)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
  metricLabel: {
    fontSize: '12px',
    color: '#a0a0a0',
    marginBottom: '10px',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    fontWeight: '500',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
  metricValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#ffffff',
    textShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
  error: {
    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1))',
    color: '#fca5a5',
    padding: '18px',
    borderRadius: '12px',
    marginBottom: '24px',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    backdropFilter: 'blur(10px)',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
  footer: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    color: 'white',
    padding: '32px 24px',
    textAlign: 'center' as const,
    fontSize: '15px',
    borderTop: '1px solid rgba(59, 130, 246, 0.2)',
    opacity: 0.9,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
};

export default App;
