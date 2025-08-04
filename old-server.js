const express = require('express');
const cors = require('cors');
const webpush = require('web-push');
const bodyParser = require('body-parser');

const app = express();

// ✅ Allow requests from your frontend domain
const allowedOrigins = [
    'https://pwa-notifications-fe-receiver.onrender.com',
    'https://pwa-notifications-fe-sender.onrender.com',
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));


app.use(bodyParser.json());

let subscriptions = [];
let messages = [];

const publicVapidKey = 'BMHHx70B6PTXRkhgu32lSVMWbYlMtiaeJ41c-ZCS9p4240vnqlgYrAXfLW0wET9chC580-QfJU1by_02McfhYJI';
const privateVapidKey = 'Mj6pkdREfFRj-ANDJIjbcOwJjwuUqy50NRI14f2MIZQ';

webpush.setVapidDetails('mailto:test@example.com', publicVapidKey, privateVapidKey);

app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);
    res.status(201).json({});
});

app.get('/notifications', async (req, res) => {
    // Example: Return only the last 10 messages
    const latest = messages.slice(-10).reverse(); // reverse to get newest first
    res.status(200).json(latest);
});

app.post('/sendNotification', async (req, res) => {
    const payload = JSON.stringify({
        title: req.body.title,
        body: req.body.body,
    });

    messages.push({ title: req.body.title, body: req.body.body })

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
