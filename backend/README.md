## BACKEND

### TODO

- getting stream id ✅
- recieving messages and console.log messages ✅
- broadcasting recieved messages ✅
- creating rooms for different streamers ✅
- storing if room exist, streamername, socket id ✅
- limiting room connection✅
- limiting recieving and broadcasting messages only from the user connected to room✅
- creating streamername for anonymous streamer

- setting up different SOCKET ROUTE
- broadcasting messages to all but sender
- creating different routes for emitting and recieving messages

# Installation

- npm i
- npm run dev or node app.js

## HOW TO CONFIG YOUR NGINX

location /ws/ {
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header Host $host;

        proxy_pass http://localhost:3100;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";   }

# THE PATH OF THE APP.JS MUST MATCH THE NGINX location path !!!
