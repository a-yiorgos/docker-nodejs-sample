module.exports = async (req, res) => {
    if (Math.random() < 0.1) {
        res.status(500).send({ status: 'fail' });
    } else {
        res.send({ status: 'ok' });
    }
};
