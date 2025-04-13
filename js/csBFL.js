// Function to handle messages from the tab
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "grabDealId") {
    try {
      let windowLink = window.location.href;
      // Remove query parameters or fragments from the link
      const cleanLink = windowLink.split(/[?#]/)[0];

      // Extract the deal ID from the cleaned link
      const urlParts = cleanLink.split("/");
      const dealId = urlParts[urlParts.length - 1]; // Get the last section of the link

      console.log("Deal ID:", dealId);
      // You can add further processing logic for the deal ID here
      chrome.storage.local.set({
        dealId: dealId,
      });
      sendResponse({ success: true, dealId });
    } catch (error) {
      console.error("Error extracting deal ID:", error);
      sendResponse({ success: false, error: error.message });
    }
  }
  return true; // Keep the message channel open for async responses
});
