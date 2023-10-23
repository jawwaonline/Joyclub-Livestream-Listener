import { Transition } from '@headlessui/react';
import { useEffect, useState } from 'react';

const testChatMessages = [
  {
    name: 'boris',
    message:
      'This is my Message it is just a little bit longer than a normal messages',
    chatImage: 'https://cfnimg.feig-partner.de/sys/100/none_uw.png'
  },
  { name: 'test3', message: 'test5' },
  { name: 'test4', message: 'test64' }
];
export default function Chat({ chatMessages }) {
  // const [isShowing, setIsShowing] = useState(false);
  // useEffect(() => {
  //   setIsShowing(true);
  //   console.log('render');
  // }, [chatMessages]);

  console.log(chatMessages);
  return (
    <>
      {chatMessages.map((chatMessage) => (
        <Transition
          key={chatMessage.chatUsername + chatMessage.chatMessage}
          appear={true}
          show={true}
          enter="transform transition duration-[600ms]"
          enterFrom="opacity-0  scale-0"
          enterTo="opacity-100  scale-100"
          leave="transform duration-200 transition ease-in-out"
          leaveFrom="opacity-100 rotate-0 scale-100 "
          leaveTo="opacity-0 scale-95 "
        >
          <article className="bg-slate-800 rounded-lg border  border-gray-500 flex-col p-3 m-3">
            <div className="flex gap-2 items-center mb-3 ">
              <img
                className="rounded-full w-10 h-10 self-center object-cover"
                src={chatMessage.chatUserImage.split(' ')[0]}
                alt={`image of ${chatMessage.chatUserName}`}
              />
              <h4 className=" text-slate-300 font-serif ">
                {chatMessage.chatUsername} -{' '}
                <span>{chatMessage.streamerName}</span>
              </h4>
            </div>

            <section>
              <p className=" text-slate-300 font-serif ">
                {chatMessage.chatMessage}
              </p>
            </section>
          </article>
        </Transition>
      ))}
    </>
  );
}
