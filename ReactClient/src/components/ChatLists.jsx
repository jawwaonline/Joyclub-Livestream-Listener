import Chat from './Chat';

export default function ChatLists({ chatMessages, showing }) {
  return (
    <>
      <main className="bg-[#457b9d] w-[90vw] h-[90vh] flex-col">
        <h3 className="text-center text-gray-400">ChatLists</h3>
        <section className="   m-4 ">
          <section className="border border-gray-400">
            <div>
              <header className="m-3">
                <p>ChannelID: </p>
                <p>Streamername: </p>
              </header>
            </div>
            <div className=" overflow-auto h-[70vh] ">
              <Chat
                chatMessages={chatMessages}
                className="border-2 h-full "
              />
            </div>
          </section>
        </section>
      </main>
    </>
  );
}
