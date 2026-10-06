const os = require('os');
const metrics = require('../metrics');

let n = 0;
let RAM = [];

module.exports = async (req, res) => {
    n += 1;

    if (RAM.length === 0) {
        RAM = new Array(1024 * 1024);
    } else {
        RAM = new Array(RAM.length * 2);
    }

    metrics.helloN.inc();
    metrics.helloRamArrayLength.set(RAM.length);
    metrics.callsToHello.inc();

    res.json({
        n: n,
        timestamp: Math.floor(Date.now() / 1000),
        hostname: os.hostname(),
        RAM: RAM.length,
    });
};
