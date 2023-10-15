## content.js

- observes the chat
- emits messages to websocket server

### TODO

- splitting streamername and message ✅
- add socket.io ✅
- solving icon issue on li Element
- avoiding anonymous streamer -> using stream id
- avoiding "still here ? "
- limit to livesteam webpage
- add time to disconnect from socketserver
- error handling
- send message to popup.js to show current connection state

## popup.html

- shows the current states
- activates listener
- shows current streamername

### TODO

- adding state symbols
- better ux

## popup.js

- recieves and sends messages from/to content.js to popup.html
- DOM handling of popup.html

### TODO

- handling / recieving streamername from content.js
- state changes on popup.html of connection

## background.js

### TODO

- recieve messages from content.js to change icon ✅
- creating other icons

# Installation

- open browser
- click on extension
- load custom extension
- load directory extension
