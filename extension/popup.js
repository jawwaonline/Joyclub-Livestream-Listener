// const textfield = document.querySelector('#text-field');
// const button = document.querySelector('#start-button');
// const observationState = document.querySelector('#observation-state');
const messagesContainer = document.querySelector('#messages');

let observationStarted = false;

async function handleResponse(response) {
  if (response.message === 'observationStarted') {
    observationStarted = true;
    observationState.style.background = 'green';
    textfield.textContent = await response.message;
    return;
  }
  if (response.message === 'THERE HAS BEEN AN ERROR') {
    observationStarted = false;
    observationState.style.background = 'red';
    textfield.textContent = await response.message;
    return;
  }

  // HANDLE RESPONSE HERE
  // IF ERROR SHOW ERROR ON THE POPUPHTML
  // IF SUCCESS DISABLE BUTTON
  // IF SERVER CONNECTION ERROR ACTIVATE BUTTON
  // SHOW ERROR ON THE POPUPHTML
}
//DOESNT WORK
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.newMessage) {
      const { message, username } = request.newMessage;
      testMessage.textContent = message;
      const messageWrapper = document.createElement('li');
      const messageElement = document.createElement('p');
      messageElement.textContent = message;
      messageWrapper.appendChild(messageElement);
      messagesContainer.appendChild(messageWrapper);
    }
  }
);

async function activateListener(e) {
  let queryOptions = {
    active: true,
    currentWindow: true
  };
  let tab = await chrome.tabs.query(queryOptions);

  chrome.tabs.sendMessage(
    tab[0].id,
    { message: 'startListening' },
    (response) => {
      handleResponse(response);
    }
  );
}

document.addEventListener('DOMContentLoaded', () => {
  button.addEventListener('click', async (e) => {
    button.style.background = 'green';
    button.textContent = 'Listening ...';

    //notifyBackgroundPage(e);
    await activateListener(e);
  });
});
