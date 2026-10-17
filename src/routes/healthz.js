const db = require('../persistence');

const liveness = async (req, res) => {
    if (Math.random() < 0.1) {
        res.status(500).send({ status: 'fail' });
    } else {
        res.send({ status: 'ok' });
    }
};

const readiness = async (req, res) => {
    try {
        const healthy = await db.isHealthy();
        if (healthy) {
            res.send({ status: 'ok' });
        } else {
            res.status(500).send({ status: 'fail' });
        }
    } catch (err) {
        res.status(500).send({ status: 'fail' });
    }
};

module.exports = {
    liveness,
    readiness,
};
