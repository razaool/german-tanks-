"""
Statistical estimators for the German Tank Problem.

The German Tank Problem involves estimating the total number of tanks (N)
based on the serial numbers of captured tanks.

Two estimation methods:
1. Naive estimator: N̂ = m (systematically underestimates)
2. MVUE (Minimum Variance Unbiased Estimator): N̂ = m(1 + 1/k) - 1
"""

import numpy as np


def naive_estimator(max_serial: int) -> int:
    """
    Naive estimator: N_hat = m

    This estimator assumes the highest serial number observed is approximately
    the total number of tanks. It systematically underestimates the true
    population because we rarely see the very last tank.

    Args:
        max_serial: The highest serial number observed in the sample (m)

    Returns:
        Estimated total number of tanks (N_hat)

    Example:
        >>> naive_estimator(95)
        95
    """
    return max_serial


def mvue_estimator(max_serial: int, sample_size: int) -> int:
    """
    Minimum Variance Unbiased Estimator (MVUE)

    N_hat = m * (1 + 1/k) - 1

    This estimator adds a "gap" based on the sample size to correct for
    the bias in the naive estimator. It provides an unbiased estimate
    of the true population.

    Intuition:
    - If you only see 1 tank (k=1), the gap is huge: N_hat = 2*m - 1
    - If you see many tanks (k large), the gap is small: N_hat ≈ m

    Args:
        max_serial: The highest serial number observed in the sample (m)
        sample_size: The number of captured tanks (k)

    Returns:
        Estimated total number of tanks (N_hat)

    Example:
        >>> mvue_estimator(95, 10)
        104  # 95 * (1 + 1/10) - 1 = 95 * 1.1 - 1 = 104.5 - 1 ≈ 104
    """
    return int(max_serial * (1 + 1 / sample_size) - 1)
