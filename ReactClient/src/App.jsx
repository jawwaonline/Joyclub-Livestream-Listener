import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import ChatLists from './components/ChatLists';

const socket = io('https://api.detailblick.com', {
	path: '/V1/hackerthon'
});

const currentTestChannels = [
	{
		streamerName: 'channel1',
		channelID: '122345',
		streamerImage: 'https://i.pravatar.cc/150?img=3'
	},
	{
		streamerName: 'channel3 ',
		channelID: '14552345',
		streamerImage: 'https://i.pravatar.cc/150?img=3'
	}
];

const currentTestMessages = [
	{
		chatUserName: 'Mike',
		channelID: '122345',
		chatUserImage: 'https://i.pravatar.cc/150?img=3',
		chatMessage:
			'This is my Message it is just a little bit longer than a normal messages'
	},

	{
		chatUserName: 'Frank',
		channelID: '122345',
		chatUserImage: 'https://i.pravatar.cc/150?img=3',
		chatMessage: 'This is just a shorter Message'
	}
];

const timeAgo = (timestampCreated) => {
	const timestampCurrent = Date.now();
	const timestampDifference = timestampCurrent - timestampCreated;

	if (timestampDifference > 24 * 60 * 60 * 1000) {
		return (
			Math.floor(timestampDifference / (24 * 60 * 60 * 1000)) +
			' days ago'
		);
	}
	if (timestampDifference > 60 * 60 * 1000) {
		return (
			Math.floor(timestampDifference / (60 * 60 * 1000)) + ' hours ago'
		);
	}
	if (timestampDifference > 60 * 1000) {
		return Math.floor(timestampDifference / (60 * 1000)) + ' minutes ago';
	}
	return 'just now';
};

function App() {
	const [streamChannels, setStreamChannels] = useState(currentTestChannels);
	const [chatMessages, setChatMessages] = useState(currentTestMessages);
	const [filteredMessages, setFilteredMessages] =
		useState(currentTestMessages);
	const [filter, setFilter] = useState('all');
	const [showing, setShowing] = useState(false);
	const setCurrentTimestamp = useRef(Date.now());

	useEffect(() => {
		socket.connect();
		socket.on('allMessages', (message) => {
			message.timestampCreated = Date.now();
			setChatMessages((prev) => [message, ...prev]);
			setShowing(true);
			//setCurrentTimestamp(Date.now());
		});
		socket.on('currentStreams', (currentstreams) => {
			setStreamChannels(currentstreams);
		});
		return () => {
			socket.disconnect();
		};
	}, []);

	useEffect(() => {
		// Listen for messages
		socket.on('currentRooms', (msg) => {
			if (Object.entries(msg).length === 0) return;
			const rooms = Object.entries(msg).map(([channelID, values]) => ({
				channelID,
				...values
			}));

			setStreamChannels(rooms);
		});

		// Cleanup ??
		return () => {
			socket.off('error');
			socket.off('receive message');
		};
	}, []);

	useEffect(() => {
		setFilteredMessages(() => {
			if (filter === 'all') {
				console.log(chatMessages);
				console.log(filteredMessages);
				console.log('filterMessageFunction');
				console.log(filter);
				return chatMessages;
			} else {
				const draft = chatMessages.filter(
					(chatMessage) => chatMessage.channelID === filter
				);
				return draft;
			}
		});
	}, [filter, chatMessages]);

	const addTestMessage = () => {
		const timestamp = Date.now();
		const testMessage = {
			chatUserName: 'Frank',
			channelID: '122345',
			chatUserImage: 'https://i.pravatar.cc/150?img=3',
			chatMessage: 'This is extra' + timestamp
		};
		//testMessage.timestampCreated = Date.now();
		setChatMessages((prev) => [testMessage, ...prev]);
	};

	return (
		/* From https://css.glass */

		<div className="md:flex-row flex-col flex w-[800px] relative min-h-[600px] min-w[600px] max-w-[80vw] h-[80vh] overflow-hidden   backdrop-blur-xl rounded-xl border border-[rgba(255,230,244,0.13)] bg-[rgba(255,230,244,0.13)] shadow-2xl ">
			{/* actual streamers wrapper*/}
			<div className="bg-[rgba(255,255,255,0.5)] md:overflow-y- auto  flex-shrink-0 overflow-x-auto  min-w-[200px] md:w-[200px] flex md:flex-col p-4 gap-2">
				{/* streamer */}
				<article
					className="hover:shadow-lg hover:cursor-pointer  ease-in-out transition md:flex-row flex-col flex items-center gap-2 text-pink-800 text-sm rounded-xl p-1 bg-[rgba(255,255,255,0.2)]"
					onClick={() => setFilter('all')}
				>
					<div className="rounded-full w-10 h-10 bg-blue-500"></div>
					<p className="p-2">all channels</p>
				</article>
				{streamChannels?.map((channel) => (
					<article
						key={channel.socketID}
						className="hover:shadow-lg hover:cursor-pointer  ease-in-out transition md:flex-row flex-col flex items-center gap-2 text-pink-800 text-sm rounded-xl p-1 bg-[rgba(255,255,255,0.2)]"
						onClick={() => setFilter(channel.channelID)}
					>
						<img
							className="rounded-full w-10 h-10 "
							src={channel.streamerImage}
							alt={`image of ${channel.streamerName}`}
						/>
						<p>{channel.streamerName}</p>
					</article>
				))}
				{/* <button onClick={addTestMessage}>clickme</button> */}
			</div>
			{/* actual chatmessages wrapper */}
			<div className="bg-[rgba(255,255,255,0.2)] min-w-[400px] flex-1 overflow-y-auto md:flex-grow p-4">
				{filteredMessages.map((message) => (
					<article
						key={message.chatMessage}
						className=" flex-row flex mb-2 gap-2 text-pink-800 text-sm items-start rounded-xl p-2 bg-[rgba(255,255,255,0.2)]"
					>
						<img
							className="rounded-full w-10 h-10 "
							src={message.chatUserImage}
							alt={`image of ${message.chatUserName}`}
						/>
						<div className="flex flex-col flex-grow mt-2">
							<span className="font-bold text-violet-900">
								{message.chatUserName}
							</span>
							<p className="mt-1">{message.chatMessage}</p>
							<span className="text-right text-slate-700 mt-5">
								{timeAgo(message.timestampCreated)}
							</span>
						</div>
					</article>
				))}
			</div>

			{/* <ChatLists chatMessages={chatMessages} /> */}
		</div>
	);
}

export default App;
