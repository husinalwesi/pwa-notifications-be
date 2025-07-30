const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './')));

const publicVapidKey = 'BPMFx6LM8kptb9EMgVbcuFo1qtgqks6d29CS5XW-xHOAMeAGCUhTKIt7mZ9fSnUN-SIKCrx9DJzOdrtT8NLW7XY';
const privateVapidKey = 'WZ3HyWcJcM5dM6DKzBbZfpIg3L6zZK8NMWgK6xiz8cQ';

webpush.setVapidDetails('mailto:test@example.com', publicVapidKey, privateVapidKey);

let subscription;

app.post('/subscribe', (req, res) => {
    subscription = req.body;
    res.status(201).json({});
});

app.get('/send-notification', (req, res) => {
    const payload = JSON.stringify({ title: 'Hello!', body: 'This is a test notification.' });
    webpush.sendNotification(subscription, payload)
        .then(() => res.send('Notification sent'))
        .catch(err => console.error(err));
});

app.listen(3000, () => console.log('Server started on port 3000'));
