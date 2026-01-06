/**
 * AnalysisToggle component - switch between Frequentist and Bayesian analysis.
 */

import React from 'react';

export type AnalysisType = 'frequentist' | 'bayesian';

interface AnalysisToggleProps {
  value: AnalysisType;
  onChange: (value: AnalysisType) => void;
  disabled: boolean;
}

export const AnalysisToggle: React.FC<AnalysisToggleProps> = ({
  value,
  onChange,
  disabled
}) => {
  return (
    <div style={styles.container}>
      <span style={styles.label}>Analysis Approach:</span>

      <div style={styles.toggleContainer}>
        <button
          onClick={() => onChange('frequentist')}
          disabled={disabled}
          style={{
            ...styles.toggleButton,
            ...(value === 'frequentist' ? styles.toggleButtonActive : styles.toggleButtonInactive),
            ...(disabled ? styles.toggleButtonDisabled : {})
          }}
        >
          Frequentist
        </button>

        <button
          onClick={() => onChange('bayesian')}
          disabled={disabled}
          style={{
            ...styles.toggleButton,
            ...(value === 'bayesian' ? styles.toggleButtonActive : styles.toggleButtonInactive),
            ...(disabled ? styles.toggleButtonDisabled : {})
          }}
        >
          Bayesian
        </button>
      </div>

      <div style={styles.description}>
        {value === 'frequentist'
          ? 'Monte Carlo simulation comparing Naive vs MVUE estimators'
          : 'Probability distribution using Bayesian inference'}
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.8), rgba(31, 31, 31, 0.8))',
    backdropFilter: 'blur(10px)',
    padding: '24px 28px',
    borderRadius: '16px',
    marginBottom: '32px',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 40px rgba(16, 185, 129, 0.08)',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
  label: {
    fontSize: '17px',
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: '16px',
    display: 'block',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
  toggleContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
  } as React.CSSProperties,
  toggleButton: {
    flex: 1,
    padding: '14px 24px',
    fontSize: '15px',
    fontWeight: '600',
    borderRadius: '12px',
    border: '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    letterSpacing: '0.3px',
    textTransform: 'uppercase' as const,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
  toggleButtonActive: {
    background: 'linear-gradient(135deg, #10b981, #06b6d4)',
    color: 'white',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
  } as React.CSSProperties,
  toggleButtonInactive: {
    background: 'linear-gradient(135deg, rgba(107, 107, 107, 0.2), rgba(75, 75, 75, 0.2))',
    color: '#a0a0a0',
    borderColor: 'rgba(107, 107, 107, 0.2)',
  } as React.CSSProperties,
  toggleButtonDisabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
  } as React.CSSProperties,
  description: {
    fontSize: '14px',
    color: '#a0a0a0',
    lineHeight: '1.5',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  } as React.CSSProperties,
};
