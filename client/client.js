document.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');
  startConnection();
});

function startConnection() {
  const socket = io('http://127.0.0.1:3000'); // Make sure to replace this with your server URL
  const messageBox = document.getElementById('messages');
  const streamer = document.getElementById('streamer');
  const connectionState = document.getElementById('connection-state');

  socket.on('connect', () => {
    console.log('Conneted to Websocket Server');
    connectionState.textContent = 'yes';
  });

  socket.on('message', (msg) => {
    const $Li = document.createElement('li');
    const $P = document.createElement('p');
    const $Span = document.createElement('span');
    $Span.textContent = msg.username;
    $P.textContent = msg.message;
    streamer.textContent = msg.streamerName;
    $Li.appendChild($Span);
    $Li.appendChild($P);
    messageBox.appendChild($Li);
  });
}
