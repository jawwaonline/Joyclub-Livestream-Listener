## content.js

- observes the chat
- emits messages to websocket server

### TODO

- splitting streamername and message ✅
- add socket.io ✅
- solving Anonymus or StreamerName ✅
- solving icon issue on li Element
- transmitting StreamerName and Channel-ID ✅
- limit to livesteam webpage ✅
- avoiding "still here ? "
- add time to disconnect from socketserver
- error handling
- send message to popup.js to show current connection state

## popup.html

- Loads current messages
- shows current streamername
- shows current state

### TODO

- adding state symbols
- better ux

## popup.js

- recieves and sends messages from/to content.js to popup.html
- DOM handling of popup.html

### TODO

- handling / recieving streamername from content.js ✅
- state changes icon on connection ✅

## background.js

### TODO

- recieve messages from content.js to change icon ✅
- creating other icons ✅

# Installation

- open browser
- click on extension
- load custom extension
- load directory extension

# THE PATH OF THE CONTENT.JS MUST MATCH THE NGINX location path !!!
