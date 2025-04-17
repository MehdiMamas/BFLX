// form link: https://www.pay.gov/public/form/start/704509645
let formId = "PV24";
let dealId;
var pageNumber = -1;
chrome.storage.local.get("dealId").then((results) => {
  dealId = results.dealId || null;
  chrome.runtime.sendMessage({ action: "ready" });
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.action === "startAutoFill" && dealId) {
      const formLink = window.location.href;
      let formLinkData = formLink.split("/").filter((e) => e != "");
      const stage = formLinkData[4];
      switch (stage) {
        case "start":
          startFormPage();
          break;
        case "entry":
          let pageSpan = document.querySelector(
            ".usa-step-indicator__current-step"
          );
          if (pageSpan) {
            let currentPageNumber = Number(pageSpan.textContent.trim());
            pageNumber = currentPageNumber;
            entryFormPage(dealId, formId);
          }
        default:
          break;
      }
    } else if (request.action === "data") {
      dealId = request.payload.dealId;
      formId = request.payload.formId;
    }
    return true; // Keep the message channel open for async responses
  });
});
