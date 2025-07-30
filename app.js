// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(() => console.log('Service Worker registered'));
}

// Ask permission and subscribe
document.getElementById('subscribe').addEventListener('click', async () => {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
        return alert('Notification permission denied');
    }

    const swReg = await navigator.serviceWorker.ready;
    const subscription = await swReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: '<YOUR_PUBLIC_VAPID_KEY>'
    });

    await fetch('/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    alert('Subscribed!');
});
