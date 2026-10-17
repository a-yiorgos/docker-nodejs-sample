const { skip, loggerMiddleware } = require('../src/logger');
const express = require('express');
const request = require('supertest');

describe('logger middleware', () => {
    describe('skip logic', () => {
        test('skips logging for successful healthz liveness calls (status < 400)', () => {
            const req = { originalUrl: '/healthz/liveness' };
            const res = { statusCode: 200 };
            expect(skip(req, res)).toBe(true);
        });

        test('skips logging for successful healthz readiness calls (status < 400)', () => {
            const req = { originalUrl: '/healthz/readiness' };
            const res = { statusCode: 200 };
            expect(skip(req, res)).toBe(true);
        });

        test('skips logging for healthz redirect calls (status 302)', () => {
            const req = { originalUrl: '/healthz' };
            const res = { statusCode: 302 };
            expect(skip(req, res)).toBe(true);
        });

        test('does NOT skip logging for failed healthz calls (status >= 400)', () => {
            const req = { originalUrl: '/healthz/liveness' };
            const res = { statusCode: 500 };
            expect(skip(req, res)).toBe(false);
        });

        test('does NOT skip logging for failed readiness calls (status >= 400)', () => {
            const req = { originalUrl: '/healthz/readiness' };
            const res = { statusCode: 500 };
            expect(skip(req, res)).toBe(false);
        });

        test('does NOT skip logging for non-healthz routes', () => {
            const req = { originalUrl: '/items' };
            const res = { statusCode: 200 };
            expect(skip(req, res)).toBe(false);
        });

        test('falls back to req.url if originalUrl is not set', () => {
            const req = { url: '/healthz/liveness' };
            const res = { statusCode: 200 };
            expect(skip(req, res)).toBe(true);
        });
    });

    describe('express logger middleware output', () => {
        let app;
        let logs;

        beforeEach(() => {
            logs = [];
            const morgan = require('morgan');
            const customMiddleware = morgan('combined', {
                skip,
                stream: {
                    write: (message) => logs.push(message.trim()),
                },
            });

            app = express();
            app.use(customMiddleware);

            app.get('/healthz/liveness', (req, res) => {
                const fail = req.query.fail === 'true';
                res.status(fail ? 500 : 200).send(
                    fail ? { status: 'fail' } : { status: 'ok' },
                );
            });

            app.get('/items', (req, res) => {
                res.status(200).send([{ id: 1 }]);
            });
        });

        test('does not log successful healthz requests', async () => {
            await request(app).get('/healthz/liveness');
            expect(logs.length).toBe(0);
        });

        test('logs failed healthz requests with HTTP verb and URL', async () => {
            await request(app).get('/healthz/liveness?fail=true');
            expect(logs.length).toBe(1);
            expect(logs[0]).toContain('GET /healthz/liveness?fail=true');
            expect(logs[0]).toContain('500');
        });

        test('logs regular requests with HTTP verb and URL', async () => {
            await request(app).get('/items');
            expect(logs.length).toBe(1);
            expect(logs[0]).toContain('GET /items');
            expect(logs[0]).toContain('200');
        });
    });
});
