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
    backgroundColor: '#f5f5f5',
  } as React.CSSProperties,
  header: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '32px 24px',
    textAlign: 'center' as const,
  } as React.CSSProperties,
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '8px',
    margin: 0,
  } as React.CSSProperties,
  subtitle: {
    fontSize: '18px',
    marginBottom: '16px',
    opacity: 0.9,
    margin: 0,
  } as React.CSSProperties,
  description: {
    fontSize: '14px',
    maxWidth: '800px',
    margin: '16px auto 0',
    lineHeight: '1.6',
    opacity: 0.8,
  } as React.CSSProperties,
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 24px',
  } as React.CSSProperties,
  metrics: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '8px',
    marginBottom: '24px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  } as React.CSSProperties,
  metricsTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#333',
  } as React.CSSProperties,
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
  } as React.CSSProperties,
  metric: {
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    textAlign: 'center' as const,
  } as React.CSSProperties,
  metricLabel: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '8px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  } as React.CSSProperties,
  metricValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  } as React.CSSProperties,
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '16px',
    borderRadius: '4px',
    marginBottom: '24px',
    border: '1px solid #f5c6cb',
  } as React.CSSProperties,
  footer: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '24px',
    textAlign: 'center' as const,
    fontSize: '14px',
  } as React.CSSProperties,
};

export default App;
