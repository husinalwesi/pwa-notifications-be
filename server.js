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

const publicVapidKey = 'BMHHx70B6PTXRkhgu32lSVMWbYlMtiaeJ41c-ZCS9p4240vnqlgYrAXfLW0wET9chC580-QfJU1by_02McfhYJI';
const privateVapidKey = 'Mj6pkdREfFRj-ANDJIjbcOwJjwuUqy50NRI14f2MIZQ';

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
