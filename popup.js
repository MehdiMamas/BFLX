chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const activeTab = tabs[0];
  const url = activeTab.url;

  const allowedHost = "https://bluefieldlaw.pipedrive.com"; // replace with your domain

  if (!url.includes(allowedHost)) {
    window.close(); // attempts to close the popup
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const rows = document.querySelectorAll("tr[id]");
  rows.forEach((row) => {
    row.addEventListener("click", () => handleRowClick(row));
  });
  const autofillButton = document.querySelector("#autofill");
  if (autofillButton) {
    autofillButton.addEventListener("click", () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(
            tabs[0].id,
            { action: "startAutoFill" },
            (response) => {
              if (chrome.runtime.lastError) {
                console.error(
                  "Error sending startAutoFill message:",
                  chrome.runtime.lastError.message
                );
              } else {
                console.log(
                  "startAutoFill message sent successfully:",
                  response
                );
              }
            }
          );
        }
      });
    });
  }
});

function handleRowClick(row) {
  const formId = row.getAttribute("data-formid").trim();
  const formUrl = row.getAttribute("data-formurl").trim();
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "grabDealId" },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            alert("Go to Pipedrive deal page and try again.");
          } else if (response && response.success) {
            const dealId = response.dealId;
            chrome.storage.local.set({ dealId: dealId }, () => {
              if (chrome.runtime.lastError) {
                console.error(
                  "Error saving dealId:",
                  chrome.runtime.lastError.message
                );
              } else {
                console.log("Deal ID saved successfully:", dealId);
                chrome.runtime.sendMessage(
                  {
                    action: "openNewTab",
                    dealId: dealId,
                    formId: formId,
                    formUrl: formUrl,
                  },
                  (response) => {
                    if (chrome.runtime.lastError) {
                      console.error(
                        "Error sending message to background script:",
                        chrome.runtime.lastError.message
                      );
                    } else {
                      console.log(
                        "Message sent to background script successfully:",
                        response
                      );
                    }
                  }
                );
              }
            });
          }
        }
      );
    }
  });
}
