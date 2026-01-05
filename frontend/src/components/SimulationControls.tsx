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
    backgroundColor: '#f8f9fa',
    padding: '24px',
    borderRadius: '8px',
    marginBottom: '24px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  } as React.CSSProperties,
  controlGroup: {
    marginBottom: '24px',
  } as React.CSSProperties,
  label: {
    display: 'block',
    width: '100%',
  } as React.CSSProperties,
  labelHeader: {
    marginBottom: '8px',
    fontSize: '16px',
    color: '#333',
  } as React.CSSProperties,
  slider: {
    width: '100%',
    marginBottom: '4px',
  } as React.CSSProperties,
  sliderLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#666',
  } as React.CSSProperties,
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    width: '100%',
  } as React.CSSProperties,
  buttonEnabled: {
    backgroundColor: '#007bff',
    color: 'white',
  } as React.CSSProperties,
  buttonDisabled: {
    backgroundColor: '#cccccc',
    color: '#666666',
    cursor: 'not-allowed',
  } as React.CSSProperties,
  error: {
    color: '#dc3545',
    fontSize: '14px',
    marginTop: '8px',
  } as React.CSSProperties,
};
