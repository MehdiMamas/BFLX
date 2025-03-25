function openNewTab(url, data) {
  chrome.tabs.create({ url }, (tab) => {
    if (tab.id) {
      chrome.runtime.onMessage.addListener(function listener(
        message,
        sender,
        sendResponse
      ) {
        if (message.tabId === tab.id && message.action === "ready") {
          chrome.runtime.onMessage.removeListener(listener);
          chrome.tabs.sendMessage(tab.id, { action: "data", payload: data });
        }
      });
    } else {
      console.error("Failed to create new tab.");
    }
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openNewTab") {
    openNewTab(message.formUrl, message);
    sendResponse({ status: "success" });
  }
});
