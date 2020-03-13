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
        //resolve case
        //resolve('This is executed once timer is done.');

        //reject case
        reject({
            code: 500,
            message: "An error occurred."
        })
    }, 3000);
});

//Chaining actions to the promise
//One way of handling promise rejection
// promise
//     .then(
//         //resolve case
//         function (promiseResult) {
//             return promiseResult; //return an synchronous value
//         },
//         //reject case
//         function (err) {
//             console.log(err.code, err.message);
//         }
//     )
//     .then(
//         function (nextResult) {
//             console.log(nextResult); //only run in resolve case, as no argument passed in reject case
//         }
//     )

promise
    .then(
        //resolve case handler
        function (promiseResult) {
            return promiseResult;
        }
        //no handler for reject case
    )
    .then(
        function (nextResult) {
            console.log(nextResult);
        }
    )
    .catch(
        //Handling errors during the promise chain, untill before the catch, and the reject case
        function (err) {
            console.log(err.code, err.message);
        }
    )
console.log('This is executed right after the setTimeout().')