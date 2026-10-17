module.exports = async (req, res) => {
    let result = '';
    const headers = req.headers || {};
    for (const [name, value] of Object.entries(headers)) {
        if (Array.isArray(value)) {
            for (const h of value) {
                result += `${name}: ${h}\n`;
            }
        } else if (value !== undefined) {
            result += `${name}: ${value}\n`;
        }
    }
    res.type('text/plain').send(result);
};
