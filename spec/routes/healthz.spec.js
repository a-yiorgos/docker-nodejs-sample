const healthz = require('../../src/routes/healthz');

describe('healthz routes', () => {
    describe('liveness', () => {
        afterEach(() => {
            jest.spyOn(Math, 'random').mockRestore();
        });

        test('it responds with status 200 when random >= 0.1', async () => {
            jest.spyOn(Math, 'random').mockReturnValue(0.5);
            const req = {};
            const res = {
                send: jest.fn(),
                status: jest.fn().mockReturnThis(),
            };

            await healthz.liveness(req, res);

            expect(res.send).toHaveBeenCalledWith({ status: 'ok' });
            expect(res.status).not.toHaveBeenCalled();
        });

        test('it responds with status 500 when random < 0.1', async () => {
            jest.spyOn(Math, 'random').mockReturnValue(0.05);
            const req = {};
            const res = {
                send: jest.fn(),
                status: jest.fn().mockReturnThis(),
            };

            await healthz.liveness(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({ status: 'fail' });
        });
    });
});
