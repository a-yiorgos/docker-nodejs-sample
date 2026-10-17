const os = require('os');

let callCount = 0;
let memoryArray = new Uint8Array(1024 * 1024);

module.exports = async (req, res) => {
    callCount += 1;
    memoryArray = new Uint8Array(memoryArray.length * 2);

    res.send({
        calls: callCount,
        timestamp: Math.floor(Date.now() / 1000),
        hostname: os.hostname(),
        array_size: memoryArray.length,
    });
};
