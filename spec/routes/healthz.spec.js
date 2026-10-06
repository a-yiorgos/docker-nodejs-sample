const healthz = require('../../src/routes/healthz');

describe('healthz route handler', () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        };
        jest.spyOn(Math, 'random');
    });

    afterEach(() => {
        Math.random.mockRestore();
    });

    test('it returns 200 OK when Math.random() >= 0.1', async () => {
        Math.random.mockReturnValue(0.5);

        await healthz(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith('OK');
    });

    test('it returns 500 Internal Server Error when Math.random() < 0.1', async () => {
        Math.random.mockReturnValue(0.05);

        await healthz(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Internal Server Error');
    });
});
