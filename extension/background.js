let iconFlag = true;

chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    if (message.command === 'changeIcon') {
      iconFlag = !iconFlag;
      chrome.action.setIcon({
        path: iconFlag
          ? {
              128: 'images/yellow.png'
            }
          : {
              128: 'images/red.png'
            },
        tabId: sender.tab.id
      });
    }
  }
);
