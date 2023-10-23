import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import ChatLists from './components/ChatLists';

const socket = io('https://api.detailblick.com', {
  path: '/V1/hackerthon'
});

const testChannels = [
  { streamerName: 'test', channelID: '122345' },
  { streamerName: 'test2 ', channelID: '14552345' }
];

function App() {
  useEffect(() => {
    socket.connect();
    socket.on('allMessages', (message) => {
      setChatMessages((prev) => [message, ...prev]);
      setShowing(true);
    });
  }, []);

  const [streamChannels, setStreamChannels] = useState(testChannels);
  const [chatMessages, setChatMessages] = useState([]);
  const [showing, setShowing] = useState(false);

  // useEffect(() => {
  //   // Listen for messages
  //   socket.on('currentRooms', (msg) => {
  //     const rooms = [...Object.keys(msg)];

  //     setStreamChannels(...rooms);
  //   });

  //   // Cleanup ??
  //   return () => {
  //     socket.off('error');
  //     socket.off('receive message');
  //   };
  // }, []);

  return (
    <div>
      <ChatLists chatMessages={chatMessages} />
    </div>
  );
}

export default App;
