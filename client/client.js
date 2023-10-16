document.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');
  startConnection();
});

function startConnection() {
  let connectionState = false;

  const socket = io('http://127.0.0.1:3000'); // Make sure to replace this with your server URL
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

  // LISTENING ALL CHATMESSAGES
  socket.on('allMessages', (msg) => {
    const { chatMessage, chatUsername, streamerName, channelID } =
      msg;
    console.log(msg);
    const $Li = document.createElement('li');
    const $P = document.createElement('p');
    const $Span = document.createElement('span');
    $Span.textContent = chatUsername;
    $P.textContent = chatMessage;
    streamer.textContent = streamerName;
    $Li.appendChild($Span);
    $Li.appendChild($P);
    messageBox.appendChild($Li);
  });

  socket.on('currentRooms', (currentRooms) => {
    currentRoomsList.textContent = '';
    if (!currentRooms.keys) {
      const $Li = document.createElement('li');
      $Li.textContent = 'no current streams available';
      currentRoomsList.appendChild($Li);
      return;
    }

    for (let room in currentRooms) {
      const { streamerName } = currentRooms[room];
      console.log(streamerName);
      const $Li = document.createElement('li');
      $Li.textContent = room + ' - ' + streamerName;
      currentRoomsList.appendChild($Li);
    }
    console.log(currentRooms);
  });
}
