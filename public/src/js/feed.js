let shareImageButton = document.querySelector('#share-image-button');
let createPostArea = document.querySelector('#create-post');
let closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
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

    })
  }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

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
  cardTitle.appendChild(cardTitleTextElement);

  let cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = 'In San Francisco';
  cardSupportingText.style.textAlign = 'center';
  cardWrapper.appendChild(cardSupportingText);

  componentHandler.upgradeElement(cardWrapper); //Using the material-design-lite library for beautiful card design
  sharedMomentsArea.appendChild(cardWrapper);

  console.log('Card created.');
}

//Reach url endpoint, send back dummy response and create card
fetch('https:/httpbin.org/get')
  .then(function (res) {
    return res.json();
  })
  .then(() => {
    console.log('Creating new card...');
    createCard();
  })