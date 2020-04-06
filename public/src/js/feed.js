let shareImageButton = document.querySelector('#share-image-button');
let createPostArea = document.querySelector('#create-post');
let closeCreatePostModalButton = document.querySelector(
  '#close-create-post-modal-btn'
);
let sharedMomentsArea = document.querySelector('#shared-moments');

//Criteria for PWA installation
function openCreatePostModal() {
  createPostArea.style.display = 'block';

  if (defferedPrompt) {
    //Show the prompt stored from earlier
    defferedPrompt.prompt();

    //Check user choice
    defferedPrompt.userChoice.then(function (choiceResult) {
      console.log(choiceResult);

      if (choiceResult.outcome === 'dismissed') {
        console.log(`[${choiceResult.outcome}] User denied installation.`);
      } else {
        console.log(`[${choiceResult.outcome}] User added to homescreen.`);
      }

      //Set the variable to null
      defferedPrompt = null;
    });
  }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

// function onSaveButtonClicked() {
//   console.log('Save button clicked.');

//   //Accesing cache, store user-requested assets
//   //Checking if cache API is supported. If not, do nothing.
//   if ('caches' in window) {
//     caches.open('userRequestedAssets')
//       .then(function (cache) {
//         cache.add('https:/httpbin.org/get');
//         cache.add('/src/images/sf-boat.jpg');
//       })
//   }
// }

//Clear all existing cards
function clearCards() {
  while (sharedMomentsArea.hasChildNodes()) {
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild); //Delete one child per iteration / loop
  }
}

function createCard() {
  let cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';

  let cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = 'url("src/images/sf-boat.jpg")';
  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.height = '180px';
  cardWrapper.appendChild(cardTitle);

  let cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = 'San Francisco Trip';
  cardTitleTextElement.style.color = 'white';
  cardTitle.appendChild(cardTitleTextElement);

  let cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = 'In San Francisco';
  cardSupportingText.style.textAlign = 'center';

  // let cardSaveButton = document.createElement('button');
  // cardSupportingText.appendChild(cardSaveButton);
  // cardSaveButton.textContent = 'Save';
  // cardSaveButton.addEventListener('click', onSaveButtonClicked);

  cardWrapper.appendChild(cardSupportingText);

  componentHandler.upgradeElement(cardWrapper); //Using the material-design-lite library for beautiful card design
  sharedMomentsArea.appendChild(cardWrapper);

  console.log('Card created.');
}

//Reach url endpoint, send back dummy response and create card
// fetch('https:/httpbin.org/get')
//   .then(function (res) {
//     return res.json();
//   })
//   .then(() => {
//     console.log('Creating new card...');
//     createCard();
//   })

//CACHING STRATERGY: cache then network
// let url = 'https:/httpbin.org/get';
let url = 'https:/httpbin.org/post'; //Using POST request for testing
let networkDataReceived = false;

//1.1  Load from network
//aka loading newest version
fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      message: 'Some message here.'
    })
  })
  .then(function (res) {
    return res.json();
  })
  .then(data => {
    networkDataReceived = true;
    console.log('From network: ', data);
    clearCards(); //Remove existing versions
    createCard(); //With network version (updated version)
  });

//1. Load from cache
if ('caches' in window) {
  caches
    .match(url)
    .then(function (response) {
      //Only if there is a response / request-response is cached
      if (response) {
        return response.json();
      }
    })
    .then(function (data) {
      //Only load from cache if cannot get from network (newest version)
      if (!networkDataReceived) {
        console.log('From cache: ', data);
        clearCards(); //Remove existing version
        createCard(); //with cached version
      }
    });
}