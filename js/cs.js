// form link: https://www.pay.gov/public/form/start/704509645

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "startAutoFill") {
    const formLink = window.location.href;
    let formLinkData = formLink.split("/").filter((e) => e != "");
    formLinkData.reverse();
    const formId = formLinkData[0];
    formLinkData.reverse();
    const stage = formLinkData[4];
    switch (stage) {
      case "start":
        startFormPage();
        break;
      case "entry":
        entryFormPage(formId);
      default:
        break;
    }
  }
});
