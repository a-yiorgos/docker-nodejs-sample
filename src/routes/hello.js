const os = require('os');

let n = 0;
let RAM = [];

module.exports = async (req, res) => {
    n += 1;

    if (RAM.length === 0) {
        RAM = new Array(1024 * 1024);
    } else {
        RAM = new Array(RAM.length * 2);
    }

    res.json({
        n: n,
        timestamp: Math.floor(Date.now() / 1000),
        hostname: os.hostname(),
        RAM: RAM.length,
    });
};
