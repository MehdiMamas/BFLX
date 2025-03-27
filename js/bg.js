function openNewTab(url, data) {
  chrome.tabs.create({ url }, (tab) => {
    if (tab.id) {
      chrome.runtime.onMessage.addListener(function listener(
        message,
        sender,
        sendResponse
      ) {
        if (sender.tab.id === tab.id && message.action === "ready") {
          chrome.runtime.onMessage.removeListener(listener);
          chrome.tabs.sendMessage(tab.id, { action: "data", payload: data });
        }
      });
    } else {
      console.error("Failed to create new tab.");
    }
  });
}
function getDataFromWebhook(dealId, formId, fields = []) {
  return new Promise((resolve, reject) => {
    fetch(
      "https://bluefieldlaw.app.n8n.cloud/webhook/bb7e13d5-9326-4355-b5ae-9ad4d84aa5d3",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deal_id: dealId,
          "form-id": formId,
          process_id: 2,
          fields,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.error("Error fetching data from webhook:", error);
        reject(error); // Properly reject the promise
      });
  });
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openNewTab") {
    openNewTab(message.formUrl, message);
    sendResponse({ status: "success" });
  } else if (message.action === "getDataFromWebhook") {
    try {
      getDataFromWebhook(message.dealId, message.formId, message.fields).then(
        (data) => {
          sendResponse(data);
        }
      );
    } catch (error) {
      console.error("Error in getDataFromWebhook:", error);
      sendResponse({ error: "Failed to fetch data" });
    }
  }
  return true;
});
