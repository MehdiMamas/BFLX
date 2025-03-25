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

async function entryFormPage(formData) {
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
        } else {
          throw new Error("Input element not found for key: " + key);
        }
      }
    });
  }
  let pageSpan = document.querySelector(".usa-step-indicator__current-step");
  let currentPageNumber = Number(pageSpan.textContent.trim());

  const data = formData[currentPageNumber - 1];
  if (!data) {
    return console.log("No data found for form autofill");
  }
  // let proceededToNextPage = false;
  let itemsAutoFilled = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const [key, value] = [item.key, item.value];
    itemsAutoFilled.push(await fillField(key, value));
  }
  if (
    itemsAutoFilled.length == data.length &&
    itemsAutoFilled.indexOf(false) == -1
  ) {
    alert("Form autofill completed. Click continue to proceed.");
    // let continueButton = document.querySelector("[name*='data[next']");
    // if (continueButton) {
    //   continueButton.click();
    // }
    // function checkPageChanged(observer) {
    //   let pageSpan = document.querySelector(
    //     ".usa-step-indicator__current-step"
    //   );
    //   if (pageSpan) {
    //     let pageNumber = Number(pageSpan.textContent.trim());
    //     if (
    //       pageNumber === currentPageNumber + 1 &&
    //       proceededToNextPage === false
    //     ) {
    //       proceededToNextPage = true;
    //       observer.disconnect();
    //       entryFormPage(formData);
    //     }
    //   }
    // }
    // const observer = new MutationObserver((mutationsList, observer) => {
    //   for (let mutation of mutationsList) {
    //     if (mutation.type === "childList" || mutation.type === "attributes") {
    //       checkPageChanged(observer);
    //     }
    //   }
    // });

    // observer.observe(document.body, {
    //   childList: true,
    //   subtree: true,
    //   attributes: true,
    // });
    // checkPageChanged(observer);
  }
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
