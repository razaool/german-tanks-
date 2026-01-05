/**
 * SimulationControls component - user input controls for the simulation.
 */

import React, { useState } from 'react';

interface SimulationControlsProps {
  onSimulate: (truePopulation: number, sampleSize: number) => void;
  isLoading: boolean;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  onSimulate,
  isLoading
}) => {
  const [truePopulation, setTruePopulation] = useState<number>(1000);
  const [sampleSize, setSampleSize] = useState<number>(20);

  const handleSimulate = () => {
    onSimulate(truePopulation, sampleSize);
  };

  const isValid = sampleSize < truePopulation && sampleSize >= 2 && truePopulation >= 100;

  return (
    <div style={styles.container}>
      <div style={styles.controlGroup}>
        <label style={styles.label}>
          <div style={styles.labelHeader}>
            True Population (N): <strong>{truePopulation.toLocaleString()}</strong>
          </div>
          <input
            type="range"
            min="100"
            max="10000"
            step="100"
            value={truePopulation}
            onChange={(e) => setTruePopulation(Number(e.target.value))}
            disabled={isLoading}
            style={styles.slider}
          />
          <div style={styles.sliderLabels}>
            <span>100</span>
            <span>10,000</span>
          </div>
        </label>
      </div>

      <div style={styles.controlGroup}>
        <label style={styles.label}>
          <div style={styles.labelHeader}>
            Sample Size (k): <strong>{sampleSize}</strong>
          </div>
          <input
            type="range"
            min="2"
            max="100"
            step="1"
            value={sampleSize}
            onChange={(e) => setSampleSize(Number(e.target.value))}
            disabled={isLoading}
            style={styles.slider}
          />
          <div style={styles.sliderLabels}>
            <span>2</span>
            <span>100</span>
          </div>
        </label>
      </div>

      <button
        onClick={handleSimulate}
        disabled={isLoading || !isValid}
        style={{
          ...styles.button,
          ...(isLoading || !isValid ? styles.buttonDisabled : styles.buttonEnabled)
        }}
      >
        {isLoading ? 'Running Simulation...' : 'Simulate Intelligence Mission'}
      </button>

      {!isValid && (
        <div style={styles.error}>
          Sample size must be less than true population
        </div>
      )}
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
    border: '1px solid rgba(59, 130, 246, 0.2)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 40px rgba(59, 130, 246, 0.08)',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
  controlGroup: {
    marginBottom: '28px',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
  label: {
    display: 'block',
    width: '100%',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
  labelHeader: {
    marginBottom: '12px',
    fontSize: '17px',
    color: '#ffffff',
    fontWeight: '500',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
  slider: {
    width: '100%',
    marginBottom: '6px',
  } as React.CSSProperties,
  sliderLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#6b6b6b',
    fontWeight: '500',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
  button: {
    padding: '16px 28px',
    fontSize: '17px',
    fontWeight: 'bold',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    width: '100%',
    letterSpacing: '0.3px',
    textTransform: 'uppercase' as const,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
  buttonEnabled: {
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    color: 'white',
    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
  } as React.CSSProperties,
  buttonDisabled: {
    background: 'linear-gradient(135deg, rgba(107, 107, 107, 0.2), rgba(75, 75, 75, 0.2))',
    color: '#6b6b6b',
    cursor: 'not-allowed',
    border: '1px solid rgba(107, 107, 107, 0.2)',
  } as React.CSSProperties,
  error: {
    color: '#f87171',
    fontSize: '14px',
    marginTop: '12px',
    textAlign: 'center' as const,
    fontWeight: '500',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
};
