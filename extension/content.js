console.log('running in content.js');

//----------------------------------------------------------------------------------------
function chatListener(streamerName) {
  // START SOCKET CONNECTION
  //--------------------------------
  const socket = io('http://localhost:3000');
  // script.onload = () => {
  //   const socket = io('http://localhost:3000');
  // };

  socket.on('connect', () => {
    console.log('Conneted to Websocket Server');
  });

  // END SOCKET CONNECTION
  //--------------------------------

  // START MUTATION OBSERVER FUNCTION
  //--------------------------------
  // SELECT THE TARGETNODE WHICH WILL BE OBSERVED
  const targetNode = document.querySelector(
    '.text_chat_message_list'
  );

  // OPTIONS WHICH MUTATIONS WILL BE OBSERVED

  const config = {
    characterData: false,
    attributes: false,
    childList: true,
    subtree: false
  };

  // CALLBACK FUNCTION WHEN MUTATION HAPPENS
  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      // ENTERING ALL MUTATIONS

      if (
        mutation.type === 'childList' &&
        mutation.addedNodes.length > 0
      ) {
        // ENTERING ALL NODES OF MUTATION
        for (const node of mutation.addedNodes) {
          //console.log(node);
          if (node.nodeName.toLowerCase() === 'li') {
            // SPLITTING MESSAGE AND USERNAME FROM MESSAGE
            // EMITTING MESSAGE, USERNAME, STREAMERNAME
            const liElement = node;
            // IGNORING MESSAGES WITHOUT TEXT
            if (
              liElement.querySelector(
                '.text_chat_user_message_content'
              ) != null &&
              liElement.querySelector(
                '.text_chat_user_message_content'
              ).textContent != null
            ) {
              const message = liElement.querySelector(
                '.text_chat_user_message_content'
              ).textContent;
              // TODO HANDEL NULL VALUE
              const username = liElement.querySelector(
                '.text_chat_sender_name'
              ).textContent;

              // EMITTING MESSAGE TO WEBSOCKETSERVER
              socket.emit('message', {
                message,
                username,
                streamerName: streamerName
              });

              // EMITTING MESSAGE TO POPUPHTML
              chrome.runtime.sendMessage({
                newMessage: { username: username, message: message }
              });
            }
          }
        }
      }
    }
  };

  // CREATE THE MUTATION OBSERVER WITH THE CALLBACKFUNCTION
  const observer = new MutationObserver(callback);

  // START OBSERVING THE MUTATION WITH TARGET AND CONFIG
  observer.observe(targetNode, config);

  // END OF MUTATION OBSERVER FUNCTION
  // --------------------------------------------------------

  // SENDING INFORMATION TO BACKGROUND SCRIPT THAT MUTATION OBSERVER HAS STARTED TO CHANGE ICON
  chrome.runtime.sendMessage({ command: 'changeIcon' });
}

// DELAY TO HANDLE THE DOM INJECTION AND STARTING THE OBSERVER
setTimeout(() => {
  const streamerName = document.querySelector(
    '.video_stream_profile .name'
  ).textContent;

  chatListener(streamerName);

  console.log('starting');
}, 5000);
