let iconFlag = true;

chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    if (message.command === 'changeIcon') {
      iconFlag = !iconFlag;
      chrome.action.setIcon({
        path: iconFlag
          ? {
              48: 'images/images.png'
            }
          : {
              48: 'images/idle.png'
            },
        tabId: sender.tab.id
      });
    }
  }
);
