const client = require('prom-client');

// Enable default process/system metrics collection
client.collectDefaultMetrics();

const helloN = new client.Counter({
    name: 'hello_n_total',
    help: 'The value n of calls in hello route',
});

const helloRamArrayLength = new client.Gauge({
    name: 'hello_ram_array_length',
    help: 'Length of RAM array in hello route',
});

const callsToRoot = new client.Counter({
    name: 'calls_to_root_total',
    help: 'Collective number of calls to /',
});

const callsToHello = new client.Counter({
    name: 'calls_to_hello_total',
    help: 'Number of calls to /hello',
});

const healthzSuccess = new client.Counter({
    name: 'healthz_calls_succeeded_total',
    help: 'Number of calls to /healthz that succeed',
});

const healthzFailure = new client.Counter({
    name: 'healthz_calls_failed_total',
    help: 'Number of calls to /healthz that respond failure',
});

const httpRequestsTotal = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'path', 'status'],
});

module.exports = {
    client,
    register: client.register,
    helloN,
    helloRamArrayLength,
    callsToRoot,
    callsToHello,
    healthzSuccess,
    healthzFailure,
    httpRequestsTotal,
};
