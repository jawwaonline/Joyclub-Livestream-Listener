console.log('running in content.js');

//----------------------------------------------------------------------------------------
function chatListener(streamerName) {
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  const channelID = url.searchParams.get('channel');

  // START SOCKET CONNECTION
  //--------------------------------
  const socket = io('http://api.detailblick.com/', {
    path: '/V1/hackerthon/',
    secure: false
  });
  // script.onload = () => {
  //   const socket = io('http://localhost:3000');
  // };

  socket.on('connect', () => {
    console.log('Conneted to Websocket Server');
  });

  socket.on('currentRooms', (rooms) => {
    console.log(rooms + 'response from server detailblick');
  });
  socket.emit('join room', channelID, streamerName);
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
            // SPLITTING MESSAGE AND CHATUSERNAME FROM CHATMESSAGE
            // EMITTING CHATMESSAGE, CHATUSERNAME, STREAMERNAME
            const liElement = node;
            // IGNORING MESSAGES WITHOUT TEXT
            if (
              liElement.querySelector(
                '.text_chat_user_message_content > span'
              )
            ) {
              const chatMessage = liElement.querySelector(
                '.text_chat_user_message_content'
              ).textContent;
              // TODO HANDEL NULL VALUE
              const chatUsername = liElement.querySelector(
                '.text_chat_sender_name'
              ).textContent;

              // GETTING CHATTER IMAGE
              const chatImage = liElement
                .querySelector('picture > source')
                .getAttribute('srcset');
              console.log(chatImage);

              // DEBUGGER
              console.log(
                streamerName +
                  '--' +
                  chatUsername +
                  '---' +
                  chatMessage
              );

              socket.emit('messagesToRoom', channelID, {
                chatMessage,
                chatUsername,
                streamerName,
                channelID
              });
            } else if (
              liElement.querySelector('.goodie_icon_container')
            ) {
              // TODO HANDEL NULL VALUE
              const chatUsername = liElement.querySelector(
                '.text_chat_sender_name'
              ).textContent;

              // Use the match() function to apply the regex pattern
              const regex = /\/goodie\/(\w+).svg/;

              const special = liElement
                .querySelector('.goodie_icon')
                .querySelector('img')
                .getAttribute('src')
                .match(regex)[1];

              // GETTING CHATTER IMAGE
              // const chatImage = liElement
              //   .querySelector('picture > source')
              //   .getAttribute('srcset');

              socket.emit('specialsToRoom', channelID, {
                chatUsername,
                streamerName,
                special
              });

              console.log('here comes the special');
              console.log(special);

              // AJAX HANDLER ON MESSAGE
              // if (chatMessage == 'vibrate') {
              //   console.log('vibrate');
              //   fetch(`http://localhost:3000/message`, {
              //     method: 'POST',
              //     body: JSON.stringify({
              //       chatMessage
              //     })
              //   });
              // }
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
  const Element = document.querySelector(
    '.video_stream_profile .name'
  );

  const streamerName = Element ? Element.textContent : 'Anonymous';

  chatListener(streamerName);

  console.log('starting');
}, 5000);
