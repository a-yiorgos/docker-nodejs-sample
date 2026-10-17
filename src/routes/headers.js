module.exports = async (req, res) => {
    const headers = req.headers || {};
    const path = req.path || req.originalUrl || req.url || '';
    if (path.split('?')[0].endsWith('/json')) {
        res.send(headers);
        return;
    }

    let result = '';
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
