"""
Flask API for the German Tank Problem simulation.

This Flask application provides REST endpoints for running Monte Carlo
simulations and analyzing estimator accuracy.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import numpy as np
from src.simulation import (
    run_monte_carlo_simulation,
    calculate_rmse,
    calculate_bias,
    calculate_variance
)
from src.bayesian import (
    calculate_bayesian_posterior,
    calculate_credible_interval,
    run_bayesian_simulation
)

app = Flask(__name__)

# Configure CORS for React frontend
# Allow requests from local development and production (Render, Vercel, etc.)
# Apply CORS globally to handle preflight requests correctly
CORS(app, resources={
    r"/*": {
        "origins": "*",  # Allow all origins for production deployment
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "max_age": 3600,
        "supports_credentials": False
    }
})


@app.route('/api/simulate', methods=['POST'])
def simulate():
    """
    Run Monte Carlo simulation for the German Tank Problem.

    Expected JSON payload:
    {
        "true_population": int (N),
        "sample_size": int (k)
    }

    Returns:
    {
        "true_population": int,
        "sample_size": int,
        "naive_estimates": [int, ...],  # 10,000 estimates
        "mvue_estimates": [int, ...],   # 10,000 estimates
        "naive_rmse": float,
        "mvue_rmse": float,
        "naive_bias": float,
        "mvue_bias": float,
        "metadata": {
            "iterations": 10000,
            "computation_time_ms": float
        }
    }

    Error responses:
        - 400: Invalid input parameters
        - 500: Internal server error
    """
    try:
        data = request.get_json()
        true_population = int(data['true_population'])
        sample_size = int(data['sample_size'])

        # Validate inputs
        if sample_size >= true_population:
            return jsonify({
                'error': 'Sample size must be less than true population'
            }), 400

        if sample_size < 2:
            return jsonify({
                'error': 'Sample size must be at least 2'
            }), 400

        if true_population < 100:
            return jsonify({
                'error': 'True population must be at least 100'
            }), 400

        if true_population > 100000:
            return jsonify({
                'error': 'True population must be at most 100,000'
            }), 400

        # Run simulation
        start_time = time.time()
        naive_estimates, mvue_estimates = run_monte_carlo_simulation(
            true_population,
            sample_size,
            num_simulations=10000
        )
        computation_time = (time.time() - start_time) * 1000  # Convert to ms

        # Calculate metrics
        naive_rmse = calculate_rmse(naive_estimates, true_population)
        mvue_rmse = calculate_rmse(mvue_estimates, true_population)
        naive_bias = calculate_bias(naive_estimates, true_population)
        mvue_bias = calculate_bias(mvue_estimates, true_population)

        return jsonify({
            'true_population': true_population,
            'sample_size': sample_size,
            'naive_estimates': naive_estimates.tolist(),
            'mvue_estimates': mvue_estimates.tolist(),
            'naive_rmse': round(naive_rmse, 2),
            'mvue_rmse': round(mvue_rmse, 2),
            'naive_bias': round(naive_bias, 2),
            'mvue_bias': round(mvue_bias, 2),
            'metadata': {
                'iterations': 10000,
                'computation_time_ms': round(computation_time, 2)
            }
        })

    except KeyError as e:
        return jsonify({
            'error': f'Missing required field: {str(e)}'
        }), 400
    except ValueError as e:
        return jsonify({
            'error': f'Invalid input: {str(e)}'
        }), 400
    except Exception as e:
        return jsonify({
            'error': f'Internal server error: {str(e)}'
        }), 500


@app.route('/api/accuracy', methods=['POST'])
def accuracy():
    """
    Calculate RMSE across multiple sample sizes.

    This endpoint runs simulations for various sample sizes to show
    how estimator accuracy improves with larger samples.

    Expected JSON payload:
    {
        "true_population": int,
        "sample_sizes": [int, ...]
    }

    Returns:
    {
        "true_population": int,
        "results": [
            {
                "sample_size": int,
                "naive_rmse": float,
                "mvue_rmse": float
            },
            ...
        ]
    }

    Error responses:
        - 400: Invalid input parameters
        - 500: Internal server error
    """
    try:
        data = request.get_json()
        true_population = int(data['true_population'])
        sample_sizes = [int(k) for k in data['sample_sizes']]

        # Validate inputs
        if true_population < 100 or true_population > 100000:
            return jsonify({
                'error': 'True population must be between 100 and 100,000'
            }), 400

        for sample_size in sample_sizes:
            if sample_size >= true_population:
                return jsonify({
                    'error': f'Sample size {sample_size} must be less than true population'
                }), 400
            if sample_size < 2:
                return jsonify({
                    'error': f'Sample size {sample_size} must be at least 2'
                }), 400

        results = []
        for sample_size in sample_sizes:
            naive_estimates, mvue_estimates = run_monte_carlo_simulation(
                true_population,
                sample_size,
                num_simulations=10000
            )

            naive_rmse = calculate_rmse(naive_estimates, true_population)
            mvue_rmse = calculate_rmse(mvue_estimates, true_population)

            results.append({
                'sample_size': sample_size,
                'naive_rmse': round(naive_rmse, 2),
                'mvue_rmse': round(mvue_rmse, 2)
            })

        return jsonify({
            'true_population': true_population,
            'results': results
        })

    except KeyError as e:
        return jsonify({
            'error': f'Missing required field: {str(e)}'
        }), 400
    except ValueError as e:
        return jsonify({
            'error': f'Invalid input: {str(e)}'
        }), 400
    except Exception as e:
        return jsonify({
            'error': f'Internal server error: {str(e)}'
        }), 500


@app.route('/api/bayesian', methods=['POST'])
def bayesian():
    """
    Calculate Bayesian posterior distribution for the German Tank Problem.

    This endpoint uses a grid approximation to calculate the posterior
    distribution of N given observed serial numbers.

    Expected JSON payload:
    {
        "true_population": int (N),
        "sample_size": int (k),
        "max_observed": int (m) - optional, will simulate if not provided
    }

    Returns:
    {
        "true_population": int,
        "sample_size": int,
        "max_observed": int,
        "n_values": [float, ...],  # Grid of N values
        "posterior": [float, ...],  # Posterior probabilities
        "map_estimate": float,  # Maximum a posteriori estimate
        "mean_estimate": float,  # Expected value of posterior
        "std_estimate": float,  # Standard deviation
        "credible_interval_95": [lower, upper],  # 95% credible interval
        "metadata": {
            "computation_time_ms": float,
            "grid_points": int
        }
    }

    Error responses:
        - 400: Invalid input parameters
        - 500: Internal server error
    """
    try:
        data = request.get_json()
        true_population = int(data['true_population'])
        sample_size = int(data['sample_size'])

        # Validate inputs
        if sample_size >= true_population:
            return jsonify({
                'error': 'Sample size must be less than true population'
            }), 400

        if sample_size < 2:
            return jsonify({
                'error': 'Sample size must be at least 2'
            }), 400

        if true_population < 100:
            return jsonify({
                'error': 'True population must be at least 100'
            }), 400

        if true_population > 100000:
            return jsonify({
                'error': 'True population must be at most 100,000'
            }), 400

        # Simulate observation if max_observed not provided
        if 'max_observed' in data and data['max_observed'] is not None:
            max_observed = int(data['max_observed'])
            if max_observed >= true_population:
                return jsonify({
                    'error': 'Max observed must be less than true population'
                }), 400
            if max_observed < 1:
                return jsonify({
                    'error': 'Max observed must be at least 1'
                }), 400
        else:
            # Simulate a random observation
            sample = np.random.choice(
                np.arange(1, true_population + 1),
                size=sample_size,
                replace=False
            )
            max_observed = int(np.max(sample))

        # Calculate posterior distribution
        start_time = time.time()
        grid_points, posterior, map_estimate, mean_estimate, std_estimate = \
            calculate_bayesian_posterior(
                max_observed,
                sample_size,
                n_grid_points=500
            )
        computation_time = (time.time() - start_time) * 1000

        # Calculate credible interval
        lower_bound, upper_bound = calculate_credible_interval(
            grid_points,
            posterior,
            confidence=0.95
        )

        return jsonify({
            'true_population': true_population,
            'sample_size': sample_size,
            'max_observed': max_observed,
            'n_values': grid_points.tolist(),
            'posterior': posterior.tolist(),
            'map_estimate': round(map_estimate, 2),
            'mean_estimate': round(mean_estimate, 2),
            'std_estimate': round(std_estimate, 2),
            'credible_interval_95': [round(lower_bound, 2), round(upper_bound, 2)],
            'metadata': {
                'computation_time_ms': round(computation_time, 2),
                'grid_points': 500
            }
        })

    except KeyError as e:
        return jsonify({
            'error': f'Missing required field: {str(e)}'
        }), 400
    except ValueError as e:
        return jsonify({
            'error': f'Invalid input: {str(e)}'
        }), 400
    except Exception as e:
        return jsonify({
            'error': f'Internal server error: {str(e)}'
        }), 500


@app.route('/health', methods=['GET'])
def health():
    """
    Health check endpoint for Docker and monitoring.

    Returns:
        200 OK with status 'healthy'
    """
    return jsonify({'status': 'healthy', 'service': 'german-tanks-backend'})


@app.route('/', methods=['GET'])
def index():
    """
    Root endpoint with API information.

    Returns:
        API documentation and available endpoints
    """
    return jsonify({
        'service': 'German Tank Problem API',
        'version': '1.0.0',
        'endpoints': {
            'POST /api/simulate': 'Run Monte Carlo simulation',
            'POST /api/accuracy': 'Calculate accuracy across sample sizes',
            'POST /api/bayesian': 'Calculate Bayesian posterior distribution',
            'GET /health': 'Health check'
        },
        'documentation': 'See README.md for usage details'
    })


if __name__ == '__main__':
    # Run Flask development server
    # In production, use Gunicorn or uWSGI
    app.run(host='0.0.0.0', port=5000, debug=True)
