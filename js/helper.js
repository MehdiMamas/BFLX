class ErrorWithoutObserver extends Error {
  constructor(message, options) {
    super(message, options);
  }
}
function startFormPage() {
  let continueButton = document.querySelector("#continueButton");

  if (continueButton) {
    continueButton.click();
  }
}
function getDataFromWebhook(dealId, formId, fields) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        action: "getDataFromWebhook",
        dealId: dealId,
        formId: formId,
        fields: fields,
      },
      (response) => {
        if (response && response.error) {
          console.error("Error fetching data from webhook:", response.error);
          reject(response.error);
        } else {
          resolve(response);
        }
      }
    );
  });
}
let finishedAutoFill = false;
let setOfFilledIds = new Set();
const observerAfterAutoFill = new MutationObserver(handleAutoFillMutation);
observerAfterAutoFill.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
});
function handleAutoFillMutation(mutationsList, observer) {
  if (finishedAutoFill == true) {
    console.log("DOM changed after autofill. Retrying...");
    finishedAutoFill = false;
    entryFormPage(dealId, formId);
  }
}
function getAllFieldsIds() {
  return Array.from(
    new Set(
      Array.from(document.querySelectorAll("[name*='data[']"))
        .filter((e) => e.type != "button")
        .filter(
          (e) => e.type != "hidden" || e.getAttribute("area-required") != "true"
        )
        .map((e) => e.getAttribute("name").split("[")[1].split("]")[0])
    )
  );
}
async function entryFormPage(dealId, formId) {
  // Observer to monitor DOM changes
  let pageSpan = document.querySelector(".usa-step-indicator__current-step");
  let currentPageNumber = Number(pageSpan.textContent.trim());
  if (currentPageNumber != pageNumber) {
    return;
  }
  function checkIfObserverMissed(fieldsToFill) {
    let fieldsToFillAfter = getAllFieldsIds().filter(
      (e) => !setOfFilledIds.has(e)
    );
    if (
      fieldsToFillAfter.filter((e) => !fieldsToFill.find((el) => el == e))
        .length > 0
    ) {
      handleAutoFillMutation([], observerAfterAutoFill);
    }
  }
  let fieldsToFill = getAllFieldsIds().filter((e) => !setOfFilledIds.has(e));
  if (fieldsToFill.length == 0) {
    console.log("No fields to fill");
    finishedAutoFill = true;
    checkIfObserverMissed(fieldsToFill);
    return;
  }
  let fieldsToAddToSetOfFilledIds = [];
  fieldsToFill.forEach((field) => {
    setOfFilledIds.add(field);
    fieldsToAddToSetOfFilledIds.push(field);
  });
  let formData = await getDataFromWebhook(dealId, formId, fieldsToFill);
  fieldsToAddToSetOfFilledIds.forEach((field) => {
    if (Object.keys(formData).indexOf(field) == -1) {
      setOfFilledIds.delete(field);
    }
  });
  console.log(formData);
  // Function to autofill form fields using the name attribute
  function fillField(key, value) {
    return new Promise((resolve, reject) => {
      let setTimeoutForErrorHandling;
      let inputElement = document.querySelector(`[name*="data[${key}]"]`);
      try {
        eventDispatch(); // Trigger change event
      } catch (error) {
        if (error instanceof ErrorWithoutObserver) {
          console.log("Couldn't find input element for key: " + key);
          // Reject the promise after a timeout
          resolve(false);
          setOfFilledIds.delete(key); // remove from the set of filled ids to retry later
        } else {
          const observer = new MutationObserver((mutationsList, observer) => {
            for (let mutation of mutationsList) {
              if (
                mutation.type === "childList" ||
                mutation.type === "attributes"
              ) {
                try {
                  eventDispatch();
                  observer.disconnect();
                } catch (error) {}
                break;
              }
            }
          });

          observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
          });
          // trigger in case it was missed by the observer
          try {
            eventDispatch();
          } catch (error) {}
          setTimeoutForErrorHandling = setTimeout(() => {
            try {
              eventDispatch();
            } catch (error) {
              observer.disconnect();
              console.log("Couldn't find input element for key: " + key);
              // Reject the promise after a timeout
              resolve(false);
              setOfFilledIds.delete(key);
            }
          }, 5000); // Stop observing after 5 seconds
        }
      }

      function eventDispatch() {
        function setValue(inputElement, value) {
          if (inputElement) {
            if (inputElement.type == "checkbox") {
              inputElement.checked = value == "true" ? true : false;
            } else {
              inputElement.value = value;
            }
            inputElement.dispatchEvent(new Event("change"));
            inputElement.dispatchEvent(new Event("input")); // Trigger change event
          }
        }
        inputElement = document.querySelector(`[name*="data[${key}]"]`);
        if (inputElement) {
          clearTimeout(setTimeoutForErrorHandling);
          if (
            inputElement.tagName == "INPUT" &&
            inputElement.parentElement.classList.contains("input-group")
            // if inputElement has more than just the input
          ) {
            let inputGroupElement = inputElement.parentElement;
            let inputToChange =
              inputGroupElement.querySelector("input:not([name])");
            if (inputToChange) {
              setValue(inputElement, value);
              setValue(inputToChange, value);
              inputToChange.click();
            } else {
              throw new Error(
                "Input element 'input group' not found for key: " + key
              );
            }
          } else if (
            inputElement == document.querySelector(`[name*="data[${key}]["]`)
            // if the input element is a radio button or checkbox
          ) {
            let inputToClick = document.querySelector(
              `[name*="data[${key}]"][id*="--${value}"]`
            );
            if (inputToClick) {
              inputToClick.click();
            } else {
              throw new ErrorWithoutObserver(
                "Input element 'value' not found for key: " + key
              );
            }
          } else {
            // if the input element is a text field or select
            setValue(inputElement, value);
            if (
              inputElement.value != value &&
              inputElement.tagName === "SELECT"
              // if the input element is a select and the options are not available yet
            ) {
              const optionExists = Array.from(inputElement.options).filter(
                (e) => e.value != ""
              );

              if (optionExists.length == 0) {
                const observerOptions = new MutationObserver(
                  (mutationsList, observer) => {
                    for (let mutation of mutationsList) {
                      if (
                        mutation.type === "childList" ||
                        mutation.type === "attributes"
                      ) {
                        const optionExists = Array.from(
                          inputElement.options
                        ).filter((e) => e.value != "");
                        if (optionExists.length > 0) {
                          eventDispatch();
                          observer.disconnect();
                          break;
                        }
                      }
                    }
                  }
                );

                observerOptions.observe(inputElement, {
                  childList: true,
                  subtree: true,
                  attributes: true,
                });

                setTimeout(() => {
                  observerOptions.disconnect();
                }, 5000); // Stop observing after 5 seconds
              } else {
                setValue(inputElement, value);
              }
            }
          }
          resolve(true);
          setOfFilledIds.add(key);
        } else {
          throw new Error("Input element not found for key: " + key);
        }
      }
    });
  }
  const data = Object.keys(formData)
    .filter((e) => e != "deal_id" && e != "form_id")
    .map((key) => {
      return { key: key, value: formData[key] };
    })
    .filter((e) => fieldsToFill.indexOf(e.key) != -1); // filter out fields that are not in the form
  if (data.length == 0) {
    finishedAutoFill = true;
    console.log(
      "fields missing data: ",
      fieldsToFill.filter((e) => data.find((f) => f.key == e) == undefined)
    );
    return;
  }
  // let proceededToNextPage = false;
  let itemsAutoFilled = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const [key, value] = [item.key, item.value];
    itemsAutoFilled.push(await fillField(key, value));
  }
  finishedAutoFill = true;
  checkIfObserverMissed(fieldsToFill);
}

function extractKeysWithCondition(obj, keys = []) {
  if (Array.isArray(obj)) {
    obj.forEach((item) => extractKeysWithCondition(item, keys));
  } else if (typeof obj === "object" && obj !== null) {
    if (
      "key" in obj &&
      obj.key.indexOf("html") != 0 &&
      obj.key.indexOf("columns") != 0 &&
      obj.input === true &&
      obj.type != "hidden" &&
      obj.type != "button" &&
      obj.type != "datasource"
    ) {
      keys.push({ key: obj.key, question: obj.label });
    }
    Object.values(obj).forEach((value) =>
      extractKeysWithCondition(value, keys)
    );
  }
  return keys;
}
