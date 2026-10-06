const metrics = require('../metrics');

module.exports = async (req, res) => {
    if (Math.random() < 0.1) {
        metrics.healthzFailure.inc();
        res.status(500).send('Internal Server Error');
    } else {
        metrics.healthzSuccess.inc();
        res.status(200).send('OK');
    }
};
