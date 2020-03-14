//Register a service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(function() {
      console.log('Service worker is registered.');
    })
    .catch(function(err) {
      console.log(err);
    });
}

let defferedPrompt;
//Prevent Chrome from prompting install right when criteria met
window.addEventListener('beforeinstallprompt', function(event) {
  console.log('beforeinstallprompt fired.');
  defferedPrompt = event; //store the prompt event for later use
  event.preventDefault();

  return false; //for not doing anything with the event
});

////Review callback functions
// setTimeout(function () {
//     console.log('This is executed once timer is done.')
// }, 3000);

// console.log('This is executed right after the setTimeout().');

//The example above. Done with Promise
let promise = new Promise(function(resolve, reject) {
  setTimeout(function() {
    //resolve case
    //resolve('This is executed once timer is done.');

    //reject case
    reject({
      code: 500,
      message: 'An error occurred.'
    });
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

//Common way to handle reject case
promise
  .then(
    //resolve case handler
    function(promiseResult) {
      return promiseResult;
    }
    //no handler for reject case
  )
  .then(function(nextResult) {
    console.log(nextResult);
  })
  .catch(
    //Handling errors during the promise chain, untill before the catch, and the promise's reject case
    function(err) {
      console.log(err.code, err.message);
    }
  );
console.log('This is executed right after the setTimeout().');

//Test fetch command - sending GET request
fetch('http://httpbin.org/ip')
  .then(function(res) {
    console.log(res);

    //Parse json to js object
    return res.json(); //this return a promise
  })
  .then(function(parsedData) {
    console.log(parsedData);
  })
  .catch(function(err) {
    console.error(err);
  });

//Test fetch command - sending POST request
fetch('http://httpbin.org/post', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json' //accept only returned data type of json - depends on which API, some dont care
  },
  body: JSON.stringify({ message: 'Does this work?' }) //data sent is set to type json. JSON.stringify parse the JS obj to JSON string
})
  .then(function(res) {
    console.log(res);

    //Parse json to js object
    return res.json(); //this return a promise
  })
  .then(function(parsedData) {
    console.log(parsedData);
  })
  .catch(function(err) {
    console.error(err);
  });
