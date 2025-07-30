self.addEventListener('push', function (event) {
    console.log('[Service Worker] Push received:', event);
    if (!event.data) {
        console.warn('[Service Worker] Push received but no data!');
        return;
    }

    const data = event.data.json();
    console.log('[Service Worker] Push data:', data);


    event.waitUntil(
        self.registration.showNotification('Test Notification', {
            body: 'If you see this, your service worker works.',
        })
    );

    // event.waitUntil(
    //     self.registration.showNotification(data.title, {
    //         body: data.body,
    //         icon: 'icon.png'
    //     })
    // );
});
