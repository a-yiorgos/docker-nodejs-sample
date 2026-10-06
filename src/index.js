const express = require('express');
const app = express();
const db = require('./persistence');
const metrics = require('./metrics');
const getItems = require('./routes/getItems');
const addItem = require('./routes/addItem');
const updateItem = require('./routes/updateItem');
const deleteItem = require('./routes/deleteItem');
const healthz = require('./routes/healthz');
const hello = require('./routes/hello');
const metricsRoute = require('./routes/metrics');

const INTERESTED_ENDPOINTS = ['/', '/healthz', '/hello'];

app.use(express.json());

app.use((req, res, next) => {
    if (INTERESTED_ENDPOINTS.includes(req.path)) {
        if (req.path === '/') {
            metrics.callsToRoot.inc();
        }
        res.on('finish', () => {
            metrics.httpRequestsTotal.inc({
                method: req.method,
                path: req.route ? req.route.path : req.path,
                status: res.statusCode.toString(),
            });
        });
    }
    next();
});

app.use(express.static(__dirname + '/static'));

app.get('/metrics', metricsRoute);
app.get('/healthz', healthz);
app.get('/hello', hello);
app.get('/items', getItems);
app.post('/items', addItem);
app.put('/items/:id', updateItem);
app.delete('/items/:id', deleteItem);

db.init().then(() => {
    app.listen(3000, () => console.log('Listening on port 3000'));
}).catch((err) => {
    console.error(err);
    process.exit(1);
});

const gracefulShutdown = () => {
    db.teardown()
        .catch(() => {})
        .then(() => process.exit());
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon
