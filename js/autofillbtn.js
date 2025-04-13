// Create the button element
const autofillButton = document.createElement("button");

// Style the button
autofillButton.textContent = "Autofill";
autofillButton.style.position = "fixed";
autofillButton.style.bottom = "20px";
autofillButton.style.right = "20px";
autofillButton.style.backgroundColor = "blue";
autofillButton.style.color = "white";
autofillButton.style.border = "none";
autofillButton.style.padding = "10px 20px";
autofillButton.style.borderRadius = "5px";
autofillButton.style.cursor = "pointer";

// Append the button to the body
document.body.appendChild(autofillButton);

// Add click event listener to the button
autofillButton.addEventListener("click", () => {
  // Send a message to the background script
  if (chrome && chrome.runtime) {
    chrome.runtime.sendMessage({ action: "autofill" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError);
      } else {
        console.log("Response from background:", response);
      }
    });
  } else {
    console.error("Chrome API is not available.");
  }
});
