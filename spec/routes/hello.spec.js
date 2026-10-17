const os = require('os');
const hello = require('../../src/routes/hello');

describe('hello route', () => {
    test('it responds with expected JSON document and updates state on calls', async () => {
        const req = {};
        const res1 = { send: jest.fn() };

        const startTime = Math.floor(Date.now() / 1000);
        await hello(req, res1);
        const endTime = Math.floor(Date.now() / 1000);

        expect(res1.send).toHaveBeenCalledTimes(1);
        const responseData1 = res1.send.mock.calls[0][0];

        expect(responseData1.calls).toBe(1);
        expect(responseData1.hostname).toBe(os.hostname());
        expect(responseData1.timestamp).toBeGreaterThanOrEqual(startTime);
        expect(responseData1.timestamp).toBeLessThanOrEqual(endTime);
        expect(responseData1.array_size).toBe(2 * 1024 * 1024);

        const res2 = { send: jest.fn() };
        await hello(req, res2);

        expect(res2.send).toHaveBeenCalledTimes(1);
        const responseData2 = res2.send.mock.calls[0][0];

        expect(responseData2.calls).toBe(2);
        expect(responseData2.hostname).toBe(os.hostname());
        expect(responseData2.array_size).toBe(4 * 1024 * 1024);
    });
});
