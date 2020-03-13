//Register a service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js')
        .then(function () {
            console.log('Service worker is registered.');
        })
}

let defferedPrompt;
//Prevent Chrome from prompting install right when criteria met
window.addEventListener('beforeinstallprompt', function (event) {
    console.log('beforeinstallprompt fired.');
    defferedPrompt = event; //store the prompt event for later use
    event.preventDefault();

    return false; //for not doing anything with the event
})

////Review callback functions
// setTimeout(function () {
//     console.log('This is executed once timer is done.')
// }, 3000);

// console.log('This is executed right after the setTimeout().');

//The example above. Done with Promise
let promise = new Promise(function (resolve, reject) {
    setTimeout(function () {
        resolve('This is executed once timer is done.');
    }, 3000);
});

//Chaining actions to the promise
promise
    .then(function (promiseResult) {
        return promiseResult; //return an synchronous value
    })
    .then(function (nextResult) {
        console.log(nextResult);
    })

console.log('This is executed right after the setTimeout().')