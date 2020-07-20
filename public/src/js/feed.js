let shareImageButton = document.querySelector('#share-image-button');
let createPostArea = document.querySelector('#create-post');
let closeCreatePostModalButton = document.querySelector(
  '#close-create-post-modal-btn'
);
let sharedMomentsArea = document.querySelector('#shared-moments');

//Create new post
let form = document.querySelector('form');
let titleInput = document.querySelector('#title');
let locationInput = document.querySelector('#location');

//sync-posts toast
let snackbarContainer = document.querySelector('#confirmation-toast');

//Criteria for PWA installation
function openCreatePostModal() {
  //createPostArea.style.display = 'block';
  createPostArea.style.transform = 'translateY(0vh)';
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

  //[TESTING] Unregistering a service worker
  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker.getRegistrations()
  //     .then(function (registrations) {
  //       for (let i = 0; i < registrations.length; i++) {
  //         registrations[i].unregister();
  //       }
  //     })
  // }
}

function closeCreatePostModal() {
  // createPostArea.style.display = 'none';
  createPostArea.style.transform = 'translateY(100vh)';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

//Fallback for background sync
const sendData  = async () =>{
  try {
    await fetch('https://pwagramproject-1.firebaseio.com/posts.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        id: new Date().toISOString(),
        title: titleInput.value,
        location: locationInput.value,
        image: 'https://firebasestorage.googleapis.com/v0/b/pwagramproject-1.appspot.com/o/IMG_7140.JPG?alt=media&token=77d22063-5de1-43cc-a5c0-75eed8dae645'
      })
    })

    await fetchUpdatedCards()
  } catch (error) {
    console.log('Errors happened.', error)
  }  
}

//Add event listener for background synchronization
form.addEventListener('submit', function (e) {
  e.preventDefault();

  //1.Check if there are data to submit
  if (titleInput.value.trim() === '' || locationInput.value.trim() === '') {
    alert('Please input valid data to post!');
    return; //end process by return nothing
  }

  //2. Close the modal
  closeCreatePostModal();

  //3. Register sync task
  if('serviceWorker' in navigator && 'SyncManager' in window){
    navigator.serviceWorker.ready
      .then(sw => {
        let post = {
          id:  new Date().toISOString(),
          title: titleInput.value,
          location: locationInput.value
        };

        //Utils function in idbUtilities.js
        writeData('sync-posts', post)
          .then( () => {            
            return sw.sync.register('sync-new-posts');
          })
          .then(() => {
            let snackbarContainer = document.querySelector('#confirmation-toast')
    
            let data = {message: 'Your Post saved for syncing.'}
    
            snackbarContainer.MaterialSnackbar.showSnackbar(data)
          })
          .catch(err => {
            console.error('Error while syncing post.', err)
          })  
      })          
  } else {
    sendData()
  }
}
)

//Helper functions
function clearCards() {
  while (sharedMomentsArea.hasChildNodes()) {
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild); //Delete one child per iteration / loop
  }
}

function createCard(dataItem) {
  let cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';

  let cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = 'url(' + dataItem.image + ')';
  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.backgroundPosition = 'center';
  cardWrapper.appendChild(cardTitle);

  //Extra styling for the card
  // cardTitle.classList.add('my-card-css');

  let cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = dataItem.title;
  cardTitleTextElement.style.color = 'white';
  cardTitle.appendChild(cardTitleTextElement);

  let cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = dataItem.location;
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

async function fetchUpdatedCards(){
  const res = await fetch('https://pwagramproject-1.firebaseio.com/posts.json')
  const data = await res.json()

  //Change data to array
  let dataArr = []
  for(item in data){
    dataArr.push(data[item])
  }

  updateUI(dataArr)
}

function updateUI(dataArray) {
  clearCards(); //Remove existing versions
  console.log('Cards cleared.')
  for (let i = 0; i < dataArray.length; i++) {
    createCard(dataArray[i]);
  }
}

//CACHING STRATERGY: cache then network
let url = 'https://pwagramproject-1.firebaseio.com/posts.json';
let networkDataReceived = false;

//1.1  Load from network
//aka loading newest version
fetch(url)
  .then(function (res) {
    return res.json();
  })
  .then((data) => {
    networkDataReceived = true;
    console.log('From network: ', data);

    //Change object received as data to array
    let dataArray = [];
    for (let item in data) {
      dataArray.push(data[item]);
      //Structure of data received from Firebase
      //{posts: {item1:{post1}, item2:{post2}, item3:{post3}}} 
      // key(item1,2,3...) - values(post,2,3...)            
    }

    updateUI(dataArray); //With network version (updated version)
  });

//1. Load from cache
if ('indexedDB' in window) {
  readAllData('posts')
    .then(function (cachedData) {
    //Only use cache if cannot get res from network
      if (!networkDataReceived) {
        console.log('From cache: ', cachedData);

        //the objects received is put into an array, no need to convert to array
        updateUI(cachedData); //With cached version
      }
    })
};
