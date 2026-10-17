const EventEmitter = require('events');
const {
    metricsMiddleware,
    metricsHandler,
    register,
    httpRequestsTotal,
    httpRequestDurationSeconds,
} = require('../src/metrics');

describe('Metrics module', () => {
    describe('metricsHandler', () => {
        test('it responds with metrics and correct Content-Type header', async () => {
            const req = {};
            const res = {
                set: jest.fn(),
                end: jest.fn(),
                status: jest.fn().mockReturnThis(),
            };

            await metricsHandler(req, res);

            expect(res.set).toHaveBeenCalledWith(
                'Content-Type',
                register.contentType,
            );
            expect(res.end).toHaveBeenCalled();
            const metricsOutput = res.end.mock.calls[0][0];
            expect(metricsOutput).toContain('http_requests_total');
            expect(metricsOutput).toContain('http_request_duration_seconds');
        });

        test('it responds with 500 status on error', async () => {
            const req = {};
            const res = {
                set: jest.fn(),
                end: jest.fn(),
                status: jest.fn().mockReturnThis(),
            };

            jest.spyOn(register, 'metrics').mockRejectedValueOnce(
                new Error('Registry error'),
            );

            await metricsHandler(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.end).toHaveBeenCalled();
        });
    });

    describe('metricsMiddleware', () => {
        test('it records request metrics when response finishes', async () => {
            const req = {
                method: 'GET',
                path: '/items',
                route: { path: '/items' },
                baseUrl: '',
            };

            const res = new EventEmitter();
            res.statusCode = 200;

            const next = jest.fn();

            metricsMiddleware(req, res, next);
            expect(next).toHaveBeenCalled();

            // Emit finish event on response
            res.emit('finish');

            const metricsText = await register.metrics();
            expect(metricsText).toContain(
                'http_requests_total{method="GET",route="/items",code="200"}',
            );
            expect(metricsText).toContain(
                'http_request_duration_seconds_count{method="GET",route="/items",code="200"}',
            );
        });

        test('it falls back to req.path when req.route is not present', async () => {
            const req = {
                method: 'GET',
                path: '/unknown-route',
            };

            const res = new EventEmitter();
            res.statusCode = 404;

            const next = jest.fn();

            metricsMiddleware(req, res, next);
            expect(next).toHaveBeenCalled();

            res.emit('finish');

            const metricsText = await register.metrics();
            expect(metricsText).toContain(
                'http_requests_total{method="GET",route="/unknown-route",code="404"}',
            );
        });
    });

    describe('default metrics', () => {
        test('includes Node.js runtime default metrics in register', async () => {
            const metricsText = await register.metrics();
            expect(metricsText).toMatch(/process_cpu_|nodejs_/);
        });
    });
});
