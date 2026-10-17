const client = require('prom-client');

/**
 * Enable Node.js default runtime metrics collection (memory, CPU, event loop lag, etc.).
 * Default metrics provide visibility into process-level resource consumption.
 */
client.collectDefaultMetrics();

/**
 * Metric 1: Total HTTP requests counter
 * Tracks total number of HTTP requests processed by method, route pattern, and status code.
 */
const httpRequestsTotal = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'code'],
});

/**
 * Metric 2: HTTP request duration latency histogram
 * Tracks request duration in seconds across custom bucket boundaries.
 */
const httpRequestDurationSeconds = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
});

/**
 * Express middleware to automatically record request metrics upon completion.
 *
 * It uses high-cardinality prevention by capturing route patterns (e.g., /items/:id)
 * instead of raw paths containing specific entity IDs (e.g., /items/123).
 */
const metricsMiddleware = (req, res, next) => {
    const end = httpRequestDurationSeconds.startTimer();

    res.on('finish', () => {
        // Express attaches `req.route` when a route matches.
        // Using req.route.path prevents high cardinality metric explosions.
        const route = req.route
            ? (req.baseUrl || '') + req.route.path
            : req.path;

        const labels = {
            method: req.method,
            route: route,
            code: res.statusCode,
        };

        httpRequestsTotal.inc(labels);
        end(labels);
    });

    next();
};

/**
 * Express route handler for /metrics endpoint.
 * Exposes all collected Prometheus metrics in standard text format.
 */
const metricsHandler = async (req, res) => {
    try {
        res.set('Content-Type', client.register.contentType);
        res.end(await client.register.metrics());
    } catch (err) {
        res.status(500).end(err);
    }
};

module.exports = {
    metricsMiddleware,
    metricsHandler,
    register: client.register,
    httpRequestsTotal,
    httpRequestDurationSeconds,
};
