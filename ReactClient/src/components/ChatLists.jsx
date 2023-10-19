import Chat from './Chat';

export default function ChatLists(streamChannels) {
  console.log(streamChannels);
  return (
    <>
      <main className="bg-slate-700 w-[90vw] h-[90vh] flex-col">
        <h3>ChatLists</h3>
        <section className="grid grid-cols-2 gap-4 h-[300px] p-2">
          <Chat />
        </section>
        {streamChannels.map((channel) => {
          return <h4>{JSON.stringify(channel)}</h4>;
        })}
      </main>
    </>
  );
}
