document.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');
  startConnection();
});

function startConnection() {
  let connectionState = false;

  const socket = io('https://api.detailblick.com/', {
    path: '/V1/hackerthon/',
    secure: false
  }); // Make sure to replace this with your server URL
  const messageBox = document.getElementById('messages');
  const streamer = document.getElementById('streamer');
  const connectionStateElement = document.getElementById(
    'connection-state'
  );

  const currentRoomsList = document.querySelector('#current-rooms');

  connectionStateElement.textContent = connectionState;

  //START CONNECTION
  socket.on('connect', () => {
    connectionState = true;
    console.log('Conneted to Websocket Server');
    connectionStateElement.textContent = connectionState;
  });

  // LISTENING ALL SPECIALS
  socket.on('allSpecials', (msg) => {
    const { special, chatUsername, streamerName, channelID } = msg;
    console.log(msg);
    const $Li = document.createElement('li');
    const $P = document.createElement('p');
    const $Span = document.createElement('span');
    const $firstChild = messageBox.firstChild;
    $Span.textContent = special;
    $P.textContent = chatUsername;
    streamer.textContent = streamerName;
    $Li.appendChild($P);
    $Li.appendChild($Span);
    messageBox.insertBefore($Li, $firstChild);
  });

  // LISTENING ALL CHATMESSAGES
  // socket.on('allMessages', (msg) => {
  //   const { chatMessage, chatUsername, streamerName, channelID } =
  //     msg;
  //   console.log(msg);
  //   const $Li = document.createElement('li');
  //   const $P = document.createElement('p');
  //   const $Span = document.createElement('span');
  //   const $firstChild = messageBox.firstChild;
  //   $P.textContent = chatMessage;
  //   streamer.textContent = streamerName;
  //   $Li.appendChild($Span);
  //   $Li.appendChild($P);
  //   messageBox.insertBefore($Li, $firstChild);
  //   messageBox.appendChild($Li);
  // });

  socket.on('currentRooms', (currentRooms) => {
    console.log('a current Room Message came');
    currentRoomsList.textContent = '';
    if (Object.keys(currentRooms).length === 0) {
      const $Li = document.createElement('li');
      $Li.textContent = 'no current streams available';
      currentRoomsList.appendChild($Li);
      return;
    }

    for (let room in currentRooms) {
      const { streamerName, channelID } = currentRooms[room];
      console.log(streamerName + '-------' + room);
      const $Li = document.createElement('li');
      $Li.textContent = room + ' - ' + streamerName;
      currentRoomsList.appendChild($Li);
      console.log(
        'here should come the current rooms' + streamerName
      );
    }
  });
}
