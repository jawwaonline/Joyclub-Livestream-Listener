import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import ChatLists from './components/ChatLists';

const socket = io('http://localhost:3000');

function App() {
  const [streamChannels, setStreamChannels] = useState([]);

  useEffect(() => {
    // Listen for messages
    socket.on('currentRooms', (msg) => {
      const rooms = [...Object.keys(msg)];

      setStreamChannels(...rooms);
    });

    // Cleanup ??
    return () => {
      socket.off('error');
      socket.off('receive message');
    };
  }, []);

  return (
    <div>
      <ChatLists streamChannels={streamChannels} />
    </div>
  );
}

export default App;
