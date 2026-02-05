self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2'
      },
      actions: [
        {
            action: 'explore', 
            title: 'Voir le ticket',
            icon: '/checkmark.png'
        },
        { 
            action: 'close', 
            title: 'Fermer',
            icon: '/xmark.png'
        },
      ]
    };
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://methode-certifiee.com') // Update with actual domain
  );
});
