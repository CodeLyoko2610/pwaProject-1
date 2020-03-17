//Check if browser supports Promise, if not use polyfill
if (!window.Promise) {
  window.Promise = Promise;
}

//Register a service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(function () {
      console.log('Service worker is registered.');
    })
    .catch(function (err) {
      console.log(err);
    });
}

let defferedPrompt;
//Prevent Chrome from prompting install right when criteria met
window.addEventListener('beforeinstallprompt', function (event) {
  console.log('beforeinstallprompt fired.');
  defferedPrompt = event; //store the prompt event for later use
  event.preventDefault();

  return false; //for not doing anything with the event
});