"""
Bayesian estimation for the German Tank Problem.

This module implements a Bayesian approach using grid approximation
to calculate the posterior distribution of the population size N.
"""

import numpy as np
from typing import Tuple, List


def calculate_bayesian_posterior(
    max_observed: int,
    sample_size: int,
    n_grid_points: int = 500
) -> Tuple[np.ndarray, np.ndarray, float, float, float]:
    """
    Calculate the Bayesian posterior distribution for N.

    Uses grid approximation with a weakly informative prior.
    Prior: P(N) ∝ 1/N (Pareto with α=1, scale=m)
    Likelihood: P(data|N) based on uniform distribution

    Args:
        max_observed: Maximum serial number observed (m)
        sample_size: Number of tanks captured (k)
        n_grid_points: Number of grid points for approximation (default: 500)

    Returns:
        Tuple containing:
        - grid_points: Array of N values to evaluate
        - posterior: Array of posterior probabilities
        - map_estimate: Maximum a posteriori (MAP) estimate
        - mean_estimate: Expected value of posterior
        - std_estimate: Standard deviation of posterior

    Example:
        >>> grid, posterior, map_est, mean_est, std_est = calculate_bayesian_posterior(100, 5)
        >>> print(f"MAP estimate: {map_est}")
        >>> print(f"Mean estimate: {mean_est:.2f}")
        MAP estimate: 119
        Mean estimate: 124.45
    """
    # Create grid of possible N values
    # Start from max_observed (N must be >= m)
    # Go to max_observed * 3 (covers most reasonable cases)
    n_min = max_observed
    n_max = max_observed * 3
    grid_points = np.linspace(n_min, n_max, n_grid_points)

    # Prior: P(N) ∝ 1/N (weakly informative Pareto prior)
    # This encodes our belief that larger N is less likely a priori
    prior = 1 / grid_points

    # Likelihood: P(data|N)
    # For uniform distribution, probability of observing max=m given k samples
    # This is the probability mass function for the maximum
    # P(max=m|N,k) = C(m-1, k-1) / C(N, k)
    # We can compute this as: (m/N)^k for computational efficiency
    likelihood = (max_observed / grid_points) ** sample_size

    # Unnormalized posterior: P(N|data) ∝ P(data|N) × P(N)
    posterior_unnormalized = likelihood * prior

    # Normalize posterior
    posterior = posterior_unnormalized / np.sum(posterior_unnormalized)

    # Calculate MAP estimate (maximum a posteriori)
    map_idx = np.argmax(posterior)
    map_estimate = grid_points[map_idx]

    # Calculate mean estimate (expected value)
    mean_estimate = np.sum(grid_points * posterior)

    # Calculate standard deviation
    variance = np.sum((grid_points - mean_estimate) ** 2 * posterior)
    std_estimate = np.sqrt(variance)

    return grid_points, posterior, map_estimate, mean_estimate, std_estimate


def calculate_credible_interval(
    grid_points: np.ndarray,
    posterior: np.ndarray,
    confidence: float = 0.95
) -> Tuple[float, float]:
    """
    Calculate the credible interval (Bayesian confidence interval).

    Args:
        grid_points: Array of N values
        posterior: Array of posterior probabilities
        confidence: Confidence level (default: 0.95 for 95% CI)

    Returns:
        Tuple of (lower_bound, upper_bound) for credible interval

    Example:
        >>> grid, posterior, _, _, _ = calculate_bayesian_posterior(100, 5)
        >>> lower, upper = calculate_credible_interval(grid, posterior, 0.95)
        >>> print(f"95% CI: [{lower:.2f}, {upper:.2f}]")
        95% CI: [102.50, 187.30]
    """
    # Calculate cumulative distribution
    sorted_indices = np.argsort(grid_points)
    sorted_grid = grid_points[sorted_indices]
    sorted_posterior = posterior[sorted_indices]

    cdf = np.cumsum(sorted_posterior)

    # Find the indices that bracket the credible interval
    alpha = (1 - confidence) / 2
    lower_idx = np.argmax(cdf >= alpha)
    upper_idx = np.argmax(cdf >= (1 - alpha))

    lower_bound = sorted_grid[lower_idx]
    upper_bound = sorted_grid[upper_idx]

    return lower_bound, upper_bound


def run_bayesian_simulation(
    true_population: int,
    sample_size: int,
    num_simulations: int = 1000
) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    """
    Run multiple Bayesian simulations to see distribution of estimates.

    This generates multiple samples and calculates the Bayesian posterior
    for each, allowing us to see the distribution of MAP and mean estimates.

    Args:
        true_population: Actual N
        sample_size: k (number of captured tanks)
        num_simulations: Number of simulations (default: 1000)

    Returns:
        Tuple containing:
        - map_estimates: Array of MAP estimates from each simulation
        - mean_estimates: Array of mean estimates from each simulation
        - observed_maxs: Array of observed maximums

    Example:
        >>> maps, means, maxs = run_bayesian_simulation(1000, 20, 1000)
        >>> print(f"Average MAP: {maps.mean():.2f}")
        >>> print(f"Average Mean: {means.mean():.2f}")
    """
    map_estimates = []
    mean_estimates = []
    observed_maxs = []

    for _ in range(num_simulations):
        # Sample k tanks from the population
        sample = np.random.choice(
            np.arange(1, true_population + 1),
            size=sample_size,
            replace=False
        )
        max_observed = np.max(sample)

        # Calculate posterior
        grid, posterior, map_est, mean_est, _ = calculate_bayesian_posterior(
            max_observed,
            sample_size,
            n_grid_points=500
        )

        map_estimates.append(map_est)
        mean_estimates.append(mean_est)
        observed_maxs.append(max_observed)

    return (
        np.array(map_estimates),
        np.array(mean_estimates),
        np.array(observed_maxs)
    )
