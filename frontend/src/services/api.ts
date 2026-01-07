/**
 * API client for communicating with the Flask backend.
 */

import axios from 'axios';
import {
  SimulationRequest,
  SimulationResponse,
  AccuracyRequest,
  AccuracyResponse,
  BayesianRequest,
  BayesianResponse
} from '../types/simulation';

// Ensure API_BASE_URL includes /api path
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE_URL = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`;

// For health check (root endpoint, not under /api)
const ROOT_BASE_URL = API_BASE_URL.replace('/api', '') || BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Separate client for endpoints not under /api
const apiRoot = axios.create({
  baseURL: ROOT_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const simulationService = {
  /**
   * Run Monte Carlo simulation for given parameters.
   */
  async runSimulation(
    request: SimulationRequest
  ): Promise<SimulationResponse> {
    const response = await api.post<SimulationResponse>(
      '/simulate',
      request
    );
    return response.data;
  },

  /**
   * Get accuracy analysis across multiple sample sizes.
   */
  async getAccuracyAnalysis(
    request: AccuracyRequest
  ): Promise<AccuracyResponse> {
    const response = await api.post<AccuracyResponse>(
      '/accuracy',
      request
    );
    return response.data;
  },

  /**
   * Calculate Bayesian posterior distribution.
   */
  async getBayesianAnalysis(
    request: BayesianRequest
  ): Promise<BayesianResponse> {
    const response = await api.post<BayesianResponse>(
      '/bayesian',
      request
    );
    return response.data;
  },

  /**
   * Health check for backend service.
   */
  async healthCheck(): Promise<{ status: string; service: string }> {
    const response = await apiRoot.get<{ status: string; service: string }>('/health');
    return response.data;
  }
};
