const express = require('express');
const cors = require('cors');
const webpush = require('web-push');
const bodyParser = require('body-parser');

const app = express();

// ✅ Allow requests from your frontend domain
app.use(cors({
  origin: 'https://pwa-notification-frontend.onrender.com', // e.g., 'https://my-pwa-frontend.onrender.com'
}));

app.use(bodyParser.json());

let subscriptions = [];

const publicVapidKey = 'BPMFx6LM8kptb9EMgVbcuFo1qtgqks6d29CS5XW-xHOAMeAGCUhTKIt7mZ9fSnUN-SIKCrx9DJzOdrtT8NLW7XY';
const privateVapidKey = 'WZ3HyWcJcM5dM6DKzBbZfpIg3L6zZK8NMWgK6xiz8cQ';

webpush.setVapidDetails('mailto:test@example.com', publicVapidKey, privateVapidKey);

app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);
    res.status(201).json({});
});

app.post('/sendNotification', async (req, res) => {
    const payload = JSON.stringify({
        title: req.body.title,
        body: req.body.body,
    });

    for (const sub of subscriptions) {
        try {
            await webpush.sendNotification(sub, payload);
        } catch (err) {
            console.error('Push error:', err);
        }
    }

    res.sendStatus(200);
});

app.listen(3000, () => console.log('Server started on port 3000'));
