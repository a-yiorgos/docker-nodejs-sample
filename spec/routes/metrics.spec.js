const metricsRoute = require('../../src/routes/metrics');
const helloRoute = require('../../src/routes/hello');
const healthzRoute = require('../../src/routes/healthz');
const { register, helloN, helloRamArrayLength, callsToHello, healthzSuccess, healthzFailure, callsToRoot, httpRequestsTotal } = require('../../src/metrics');

describe('metrics route and prometheus tracking', () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            set: jest.fn().mockReturnThis(),
            end: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    test('metrics route handler outputs prometheus format metrics', async () => {
        await metricsRoute(req, res);

        expect(res.set).toHaveBeenCalledWith('Content-Type', register.contentType);
        expect(res.end).toHaveBeenCalled();
        const output = res.end.mock.calls[0][0];
        expect(output).toContain('hello_n_total');
        expect(output).toContain('hello_ram_array_length');
        expect(output).toContain('calls_to_root_total');
        expect(output).toContain('calls_to_hello_total');
        expect(output).toContain('healthz_calls_succeeded_total');
        expect(output).toContain('healthz_calls_failed_total');
        expect(output).toContain('process_cpu_user_seconds_total');
    });

    test('hello route updates metrics', async () => {
        const initialN = (await helloN.get()).values[0]?.value || 0;
        const initialCalls = (await callsToHello.get()).values[0]?.value || 0;

        await helloRoute(req, res);

        const newN = (await helloN.get()).values[0]?.value || 0;
        const newCalls = (await callsToHello.get()).values[0]?.value || 0;
        const ramVal = (await helloRamArrayLength.get()).values[0]?.value || 0;

        expect(newN).toBe(initialN + 1);
        expect(newCalls).toBe(initialCalls + 1);
        expect(ramVal).toBeGreaterThan(0);
    });

    test('healthz route updates success and failure metrics', async () => {
        jest.spyOn(Math, 'random').mockReturnValue(0.5); // Success
        const initialSuccess = (await healthzSuccess.get()).values[0]?.value || 0;
        await healthzRoute(req, res);
        const newSuccess = (await healthzSuccess.get()).values[0]?.value || 0;
        expect(newSuccess).toBe(initialSuccess + 1);

        Math.random.mockReturnValue(0.05); // Failure
        const initialFailure = (await healthzFailure.get()).values[0]?.value || 0;
        await healthzRoute(req, res);
        const newFailure = (await healthzFailure.get()).values[0]?.value || 0;
        expect(newFailure).toBe(initialFailure + 1);

        Math.random.mockRestore();
    });
});
