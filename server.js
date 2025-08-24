const express = require('express');
const cors = require('cors');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const basePath = '';
// const basePath = '/backend';
const app = express();

const subscriptionsFile = path.join(__dirname, 'subscriptions.json');

const allowedOrigins = [
    'https://doorapp.ihorizons.org',
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

// Load existing subscriptions from file (if any)
let subscriptions = [];
try {
    if (fs.existsSync(subscriptionsFile)) {
        const data = fs.readFileSync(subscriptionsFile);
        subscriptions = JSON.parse(data);
    }
} catch (error) {
    console.error('Failed to read subscriptions.json:', error);
}

// In-memory messages (optional: can persist this as well)
let messages = [];

const publicVapidKey = 'BMHHx70B6PTXRkhgu32lSVMWbYlMtiaeJ41c-ZCS9p4240vnqlgYrAXfLW0wET9chC580-QfJU1by_02McfhYJI';
const privateVapidKey = 'Mj6pkdREfFRj-ANDJIjbcOwJjwuUqy50NRI14f2MIZQ';

webpush.setVapidDetails('mailto:test@example.com', publicVapidKey, privateVapidKey);

// Save updated subscriptions to file
function saveSubscriptionsToFile() {
    fs.writeFile(subscriptionsFile, JSON.stringify(subscriptions, null, 2), (err) => {
        if (err) console.error('Failed to write subscriptions file:', err);
    });
}

app.get(`${basePath}/test`, (req, res) => {
    //app.get('/test', (req, res) => {
    res.status(200).json([]);
});

app.get(`${basePath}/subscriptions`, (req, res) => {
    // app.get('/subscriptions', (req, res) => {
    res.status(200).json(subscriptions);
});

app.post(`${basePath}/subscribe-emptify`, (req, res) => {
    // app.post('/subscribe-emptify', (req, res) => {
    subscriptions = [];
    saveSubscriptionsToFile();
    res.status(201).json({});
});


app.post(`${basePath}/subscribe`, (req, res) => {
    // app.post('/subscribe', (req, res) => {
    const subscriptionData = req.body.subscription;

    const team = req.body.team;
    const innerteam = req.body.innerteam;

    const subscription = { ...subscriptionData, ...team, ...innerteam };

    // Avoid duplicates
    const exists = subscriptions.find(sub => JSON.stringify(sub) === JSON.stringify(subscription));
    if (!exists) {
        subscriptions.push(subscription);
        saveSubscriptionsToFile(); // Save to file
    }

    res.status(201).json({});
});


app.get(`${basePath}/notifications`, (req, res) => {
    // app.get('/notifications', async (req, res) => {
    const latest = messages.slice(-10).reverse();
    res.status(200).json(latest);
});

app.post(`${basePath}/sendNotification`, async (req, res) => {
    // app.post('/sendNotification', async (req, res) => {
    const payload = JSON.stringify({
        title: req.body.title,
        body: req.body.body,
    });

    messages.push({ title: req.body.title, body: req.body.body, timestamp: new Date().toISOString() });

    for (const sub of subscriptions) {
        try {
            await webpush.sendNotification(sub, payload);
        } catch (err) {
            console.error('Push error:', err);
        }
    }

    res.sendStatus(200);
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log('Server started on port 3000'));
