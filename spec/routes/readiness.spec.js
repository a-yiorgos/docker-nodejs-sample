const healthz = require('../../src/routes/healthz');
const db = require('../../src/persistence');

jest.mock('../../src/persistence', () => ({
    isHealthy: jest.fn(),
}));

describe('readiness route', () => {
    test('it responds with status 200 when db is healthy', async () => {
        db.isHealthy.mockResolvedValue(true);
        const req = {};
        const res = {
            send: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await healthz.readiness(req, res);

        expect(res.send).toHaveBeenCalledWith({ status: 'ok' });
        expect(res.status).not.toHaveBeenCalled();
    });

    test('it responds with status 500 when db is unhealthy', async () => {
        db.isHealthy.mockResolvedValue(false);
        const req = {};
        const res = {
            send: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await healthz.readiness(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({ status: 'fail' });
    });

    test('it responds with status 500 when db check throws an error', async () => {
        db.isHealthy.mockRejectedValue(new Error('DB error'));
        const req = {};
        const res = {
            send: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await healthz.readiness(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({ status: 'fail' });
    });
});
