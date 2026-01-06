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

export interface BayesianRequest {
  true_population: number;
  sample_size: number;
  max_observed?: number;
}

export interface BayesianResponse {
  true_population: number;
  sample_size: number;
  max_observed: number;
  n_values: number[];
  posterior: number[];
  map_estimate: number;
  mean_estimate: number;
  std_estimate: number;
  credible_interval_95: [number, number];
  metadata: {
    computation_time_ms: number;
    grid_points: number;
  };
}

export interface PosteriorDataPoint {
  n: number;
  probability: number;
}
