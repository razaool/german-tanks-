# German Tank Problem - Statistical Estimation Visualization

A full-stack interactive visualization demonstrating the famous German Tank Problem from World War II. This application compares naive vs. Minimum Variance Unbiased Estimator (MVUE) methods using Monte Carlo simulations.

## The Historical Context

During WWII, the Allies sought to estimate German tank production:
- **Intelligence Approach**: Estimated 1,000-1,400 tanks/month (based on spies and decryption)
- **Statistical Approach**: Analyzed serial numbers from captured tanks, estimated 246 tanks/month
- **Actual Production**: German records revealed 245 tanks/month

This application demonstrates why the statistical approach was so remarkably accurate.

## The Mathematics

### Problem Setup
- **True Population**: N tanks numbered 1, 2, 3, ..., N
- **Sample Size**: k tanks captured
- **Observed Maximum**: m (highest serial number in the sample)

### Two Estimation Methods

1. **Naive Estimator** (Intuitive but Biased)
   ```
   N̂ = m
   ```
   - Simply uses the highest serial number seen
   - Systematically **underestimates** the true population
   - Bias is larger when sample size is small

2. **MVUE Estimator** (Minimum Variance Unbiased Estimator)
   ```
   N̂ = m(1 + 1/k) - 1
   ```
   - Adds a "gap" based on sample size
   - Provides **unbiased** estimates
   - More accurate across all sample sizes

## Tech Stack

- **Backend**: Flask (Python) + NumPy for Monte Carlo simulations
- **Frontend**: React 18 + TypeScript + Vite
- **Visualization**: Recharts + d3-array
- **Deployment**: Docker + nginx
- **Performance**: 10,000 iterations in ~100-200ms using NumPy vectorization

## Project Structure

```
german-tanks-/
├── backend/
│   ├── app.py                    # Flask API with CORS
│   ├── requirements.txt          # Python dependencies
│   ├── Dockerfile                # Backend container
│   └── src/
│       ├── simulation.py         # Monte Carlo engine (NumPy)
│       └── estimators.py         # Naive & MVUE functions
├── frontend/
│   ├── package.json              # Node dependencies
│   ├── tsconfig.json            # TypeScript config
│   ├── Dockerfile                # Frontend container (multi-stage)
│   └── src/
│       ├── App.tsx               # Main React component
│       ├── main.tsx              # React entry point
│       ├── components/
│       │   ├── SimulationControls.tsx    # N and k sliders
│       │   ├── DistributionChart.tsx     # Histogram visualization
│       │   └── AccuracyChart.tsx         # RMSE line plot
│       ├── services/
│       │   └── api.ts           # Axios API client
│       └── types/
│           └── simulation.ts    # TypeScript types
├── nginx/
│   └── nginx.conf               # Reverse proxy configuration
├── docker-compose.yml           # Multi-container orchestration
└── README.md
```

## Quick Start with Docker (Recommended)

### Prerequisites
- Docker and Docker Compose installed

### Run the Application

```bash
# Clone the repository
git clone <repository-url>
cd german-tanks-

# Start all services
docker-compose up --build

# Access the application
open http://localhost
```

The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:5000

### Stop the Application

```bash
docker-compose down
```

## Local Development

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run Flask development server
python app.py
```

Backend will run on http://localhost:5000

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run Vite development server
npm run dev
```

Frontend will run on http://localhost:5173

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Run with production server
npm run preview
```

## Usage

1. **Set Parameters**:
   - **True Population (N)**: Use the slider to set the actual number of tanks (100-10,000)
   - **Sample Size (k)**: Set how many tanks were captured (2-100)

2. **Run Simulation**:
   - Click "Simulate Intelligence Mission" to run 10,000 Monte Carlo iterations

3. **View Results**:
   - **Distribution Chart**: Histogram showing estimate frequencies
     - Blue bars: Naive estimates (left-shifted/biased low)
     - Green bars: MVUE estimates (centered/unbiased)
     - Red reference line: True N
   - **Accuracy Chart**: Line plot showing RMSE vs sample size
     - Demonstrates how error decreases with larger samples
   - **Performance Metrics**: Computation time, RMSE values, bias

## API Endpoints

### POST /api/simulate
Run Monte Carlo simulation for given parameters.

**Request**:
```json
{
  "true_population": 1000,
  "sample_size": 20
}
```

**Response**:
```json
{
  "true_population": 1000,
  "sample_size": 20,
  "naive_estimates": [980, 1020, 950, ...],
  "mvue_estimates": [1005, 998, 1012, ...],
  "naive_rmse": 45.2,
  "mvue_rmse": 28.7,
  "naive_bias": -48.5,
  "mvue_bias": 0.3,
  "metadata": {
    "iterations": 10000,
    "computation_time_ms": 150
  }
}
```

### POST /api/accuracy
Calculate RMSE across multiple sample sizes.

**Request**:
```json
{
  "true_population": 1000,
  "sample_sizes": [5, 10, 15, 20, 25, 30]
}
```

**Response**:
```json
{
  "true_population": 1000,
  "results": [
    {"sample_size": 5, "naive_rmse": 120.5, "mvue_rmse": 85.3},
    {"sample_size": 10, "naive_rmse": 85.2, "mvue_rmse": 58.7}
  ]
}
```

### GET /health
Health check endpoint.

**Response**:
```json
{
  "status": "healthy",
  "service": "german-tanks-backend"
}
```

## Key Implementation Details

### Performance Optimization
- **NumPy Vectorization**: All 10,000 iterations run in parallel using array operations
- **No Python Loops**: Monte Carlo simulation uses pure NumPy for ~100-200ms computation time
- **Frontend Memoization**: Expensive computations wrapped in React `useMemo`

### Histogram Implementation
- **Challenge**: Recharts lacks native histogram support
- **Solution**: Use `d3-array` bin function to pre-process data, render with Recharts BarChart
- **Result**: Efficient histogram with 50 bins showing both estimators

### CORS Configuration
- Flask uses `flask-cors` extension
- Allows requests from Vite dev server (localhost:5173) and production (localhost:3000)
- In production, nginx reverse proxy handles routing

## Future Enhancements

- [ ] Bayesian estimation with probability distributions
- [ ] Confidence intervals on charts
- [ ] Export simulation data as CSV
- [ ] Historical WWII context section
- [ ] Animated histogram transitions
- [ ] Comparison mode for multiple simulations
- [ ] Backend caching for identical parameters

## Educational Value

This project demonstrates:
1. **Bias-Variance Tradeoff**: How naive estimators can be systematically biased
2. **Law of Large Numbers**: Accuracy improves with larger samples
3. **Monte Carlo Methods**: Using simulation to understand statistical properties
4. **Maximum Likelihood Estimation**: Intuition behind MVUE formula
5. **Full-Stack Development**: Flask API + React frontend + Docker deployment

## Sources

- [German Tank Problem - Wikipedia](https://en.wikipedia.org/wiki/German_tank_problem)
- [How to Dockerize a React + Flask Project](https://blog.miguelgrinberg.com/post/how-to-dockerize-a-react-flask-project)
- [Recharts Documentation](https://recharts.org/)
- [NumPy Performance Guide](https://edbennett.github.io/high-performance-python/06-numpy-scipy/index.html)

## License

This project is open source and available for educational purposes.

## Contributing

Contributions are welcome! Areas for improvement:
- Additional estimators (Bayesian, MLE)
- Enhanced visualizations
- Performance optimizations
- Educational content and explanations
