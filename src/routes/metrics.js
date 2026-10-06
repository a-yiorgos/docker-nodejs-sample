const { register } = require('../metrics');

module.exports = async (req, res) => {
    try {
        res.set('Content-Type', register.contentType);
        res.end(await register.metrics());
    } catch (err) {
        res.status(500).send(err);
    }
};
