var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');

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