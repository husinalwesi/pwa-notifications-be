const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './')));

const publicVapidKey = '<YOUR_PUBLIC_VAPID_KEY>';
const privateVapidKey = '<YOUR_PRIVATE_VAPID_KEY>';

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
