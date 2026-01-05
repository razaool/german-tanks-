"""
Monte Carlo simulation engine for the German Tank Problem.

This module uses vectorized NumPy operations to efficiently run thousands
of simulations, comparing naive vs MVUE estimators.
"""

import numpy as np
from typing import Tuple
from .estimators import naive_estimator, mvue_estimator


def run_monte_carlo_simulation(
    true_population: int,
    sample_size: int,
    num_simulations: int = 10000
) -> Tuple[np.ndarray, np.ndarray]:
    """
    Run Monte Carlo simulation using vectorized NumPy operations.

    Key performance optimizations:
    - np.random.choice for efficient random sampling
    - Vectorized operations across all simulations simultaneously
    - No Python loops - all computation in NumPy

    Args:
        true_population: N (actual number of tanks, serial numbers 1 to N)
        sample_size: k (number of captured tanks to observe)
        num_simulations: Number of Monte Carlo iterations (default: 10,000)

    Returns:
        Tuple of (naive_estimates, mvue_estimates) as NumPy arrays
        - naive_estimates: Array of naive estimator results
        - mvue_estimates: Array of MVUE estimator results

    Example:
        >>> naive, mvue = run_monte_carlo_simulation(1000, 20, 10000)
        >>> print(f"Naive mean: {naive.mean()}, MVUE mean: {mvue.mean()}")
        Naive mean: 950.2, MVUE mean: 999.8

    Performance:
        - 10,000 iterations complete in ~100-200ms
        - Memory usage: ~160KB for 10,000 iterations (2 * 10,000 * 8 bytes)
    """
    # Generate all samples at once using NumPy broadcasting
    # Shape: (num_simulations, sample_size)
    # Each row is one simulation with k randomly selected serial numbers
    samples = np.random.choice(
        np.arange(1, true_population + 1),
        size=(num_simulations, sample_size),
        replace=True
    )

    # Find maximum serial number in each sample
    # Shape: (num_simulations,)
    max_serials = np.max(samples, axis=1)

    # Calculate naive estimates (vectorized)
    # Naive: N_hat = m
    naive_estimates = max_serials

    # Calculate MVUE estimates (vectorized)
    # MVUE: N_hat = m * (1 + 1/k) - 1
    mvue_estimates = max_serials * (1 + 1 / sample_size) - 1

    return naive_estimates.astype(int), mvue_estimates.astype(int)


def calculate_rmse(estimates: np.ndarray, true_value: int) -> float:
    """
    Calculate Root Mean Squared Error (RMSE).

    RMSE measures the average magnitude of estimation errors.
    Lower RMSE indicates better estimator performance.

    Formula:
        RMSE = sqrt(mean((estimates - true_value)^2))

    Args:
        estimates: Array of estimated values from simulations
        true_value: The actual true value (N)

    Returns:
        RMSE as a float

    Example:
        >>> estimates = np.array([950, 1000, 1050])
        >>> calculate_rmse(estimates, 1000)
        40.825  # sqrt(((950-1000)^2 + (1000-1000)^2 + (1050-1000)^2) / 3)
    """
    squared_errors = (estimates - true_value) ** 2
    mean_squared_error = np.mean(squared_errors)
    return float(np.sqrt(mean_squared_error))


def calculate_bias(estimates: np.ndarray, true_value: int) -> float:
    """
    Calculate the bias of an estimator.

    Bias = E[N_hat] - N
    - Positive bias: Overestimation on average
    - Negative bias: Underestimation on average
    - Zero bias: Unbiased estimator

    Args:
        estimates: Array of estimated values from simulations
        true_value: The actual true value (N)

    Returns:
        Bias as a float

    Example:
        >>> estimates = np.array([950, 960, 970])  # Systematically low
        >>> calculate_bias(estimates, 1000)
        -40.0  # Underestimates by 40 on average
    """
    return float(np.mean(estimates) - true_value)


def calculate_variance(estimates: np.ndarray) -> float:
    """
    Calculate the variance of an estimator.

    Variance measures how spread out the estimates are.
    Lower variance indicates more consistent estimates.

    Args:
        estimates: Array of estimated values from simulations

    Returns:
        Variance as a float
    """
    return float(np.var(estimates))
