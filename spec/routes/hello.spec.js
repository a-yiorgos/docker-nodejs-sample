const os = require('os');
const hello = require('../../src/routes/hello');

describe('hello route handler', () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            json: jest.fn().mockReturnThis(),
        };
    });

    test('it returns expected properties and increments n and doubles RAM size on subsequent calls', async () => {
        const nowInSeconds = 1700000000;
        jest.spyOn(Date, 'now').mockReturnValue(nowInSeconds * 1000);
        jest.spyOn(os, 'hostname').mockReturnValue('test-hostname');

        // First call
        await hello(req, res);

        expect(res.json).toHaveBeenCalledWith({
            n: 1,
            timestamp: nowInSeconds,
            hostname: 'test-hostname',
            RAM: 1024 * 1024,
        });

        // Second call
        await hello(req, res);

        expect(res.json).toHaveBeenLastCalledWith({
            n: 2,
            timestamp: nowInSeconds,
            hostname: 'test-hostname',
            RAM: 1024 * 1024 * 2,
        });

        // Third call
        await hello(req, res);

        expect(res.json).toHaveBeenLastCalledWith({
            n: 3,
            timestamp: nowInSeconds,
            hostname: 'test-hostname',
            RAM: 1024 * 1024 * 4,
        });

        Date.now.mockRestore();
        os.hostname.mockRestore();
    });
});
