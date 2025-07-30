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

    const applicationServerKey = urlBase64ToUint8Array('BMHHx70B6PTXRkhgu32lSVMWbYlMtiaeJ41c-ZCS9p4240vnqlgYrAXfLW0wET9chC580-QfJU1by_02McfhYJI');

    const subscription = await swReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
    });

    await fetch('https://pwa-notification.onrender.com/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    alert('Subscribed!');
});


function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
