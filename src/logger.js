const morgan = require('morgan');

const skip = (req, res) => {
    const url = req.originalUrl || req.url || '';
    if (url.startsWith('/healthz')) {
        return res.statusCode < 400;
    }
    return false;
};

const loggerMiddleware = morgan('combined', { skip });

module.exports = {
    loggerMiddleware,
    skip,
};
