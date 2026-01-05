/**
 * TypeScript type definitions for the German Tank Problem application.
 */

export interface SimulationRequest {
  true_population: number;
  sample_size: number;
}

export interface SimulationResponse {
  true_population: number;
  sample_size: number;
  naive_estimates: number[];
  mvue_estimates: number[];
  naive_rmse: number;
  mvue_rmse: number;
  naive_bias: number;
  mvue_bias: number;
  metadata: {
    iterations: number;
    computation_time_ms: number;
  };
}

export interface AccuracyRequest {
  true_population: number;
  sample_sizes: number[];
}

export interface AccuracyResponse {
  true_population: number;
  results: AccuracyDataPoint[];
}

export interface AccuracyDataPoint {
  sample_size: number;
  naive_rmse: number;
  mvue_rmse: number;
}

export interface HistogramBin {
  estimate: number;
  naive_count: number;
  mvue_count: number;
}
