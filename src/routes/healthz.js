module.exports = async (req, res) => {
    if (Math.random() < 0.1) {
        res.status(500).send('Internal Server Error');
    } else {
        res.status(200).send('OK');
    }
};
