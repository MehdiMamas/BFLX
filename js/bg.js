let savedTabIds = new Set();

chrome.action.onClicked.addListener(function (tab) {
  savedTabIds.add(tab.id);
  chrome.tabs.sendMessage(tab.id, { action: "startAutoFill" });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (savedTabIds.has(tabId) && changeInfo.status === "complete") {
    chrome.tabs.sendMessage(tabId, { action: "startAutoFill" });
  }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "doneAutoFill" && sender.tab) {
    savedTabIds.delete(sender.tab.id);
  }
});
