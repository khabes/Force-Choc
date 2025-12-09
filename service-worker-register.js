// ENREGISTREMENT DU SERVICE WORKER POUR LA FONCTIONNALITÉ PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => {
        console.log('ServiceWorker enregistré avec succès. Scope:', registration.scope);
      })
      .catch(error => {
        console.log('Échec de l\'enregistrement du ServiceWorker:', error);
      });
  });
}
