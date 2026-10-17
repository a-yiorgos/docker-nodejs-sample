const headers = require('../../src/routes/headers');

describe('headers route', () => {
    test('it responds with headers formatted as name: value', async () => {
        const req = {
            headers: {
                host: 'localhost:3000',
                'user-agent': 'curl/7.68.0',
                accept: '*/*',
            },
        };
        const res = {
            type: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        await headers(req, res);

        expect(res.type).toHaveBeenCalledWith('text/plain');
        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith(
            'host: localhost:3000\nuser-agent: curl/7.68.0\naccept: */*\n',
        );
    });

    test('it handles array header values correctly', async () => {
        const req = {
            headers: {
                'accept-encoding': ['gzip', 'deflate'],
                host: 'localhost:3000',
            },
        };
        const res = {
            type: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        await headers(req, res);

        expect(res.type).toHaveBeenCalledWith('text/plain');
        expect(res.send).toHaveBeenCalledWith(
            'accept-encoding: gzip\naccept-encoding: deflate\nhost: localhost:3000\n',
        );
    });

    test('it handles empty headers gracefully', async () => {
        const req = {};
        const res = {
            type: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        await headers(req, res);

        expect(res.type).toHaveBeenCalledWith('text/plain');
        expect(res.send).toHaveBeenCalledWith('');
    });

    test('it responds with JSON object when path is /headers/json', async () => {
        const req = {
            path: '/headers/json',
            headers: {
                host: 'localhost:3000',
                'user-agent': 'curl/7.68.0',
                accept: '*/*',
            },
        };
        const res = {
            type: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        await headers(req, res);

        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith({
            host: 'localhost:3000',
            'user-agent': 'curl/7.68.0',
            accept: '*/*',
        });
        expect(res.type).not.toHaveBeenCalled();
    });

    test('it handles empty headers gracefully when path is /headers/json', async () => {
        const req = {
            path: '/headers/json',
        };
        const res = {
            type: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        await headers(req, res);

        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith({});
    });
});
