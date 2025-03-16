function startFormPage() {
  let continueButton = document.querySelector("#continueButton");

  if (continueButton) {
    continueButton.click();
  }
}

async function entryFormPage1(formData) {
  // Function to autofill form fields using the name attribute
  function fillField(key, value) {
    return new Promise((resolve, reject) => {
      let setTimeoutForErrorHandling;
      let inputElement = document.querySelector(`[name*="data[${key}]"]`);
      try {
        eventDispatch(); // Trigger change event
      } catch (error) {
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

      function eventDispatch() {
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
              inputToChange.value = value;
              inputToChange.dispatchEvent(new Event("input")); // Trigger change event
              inputToChange.dispatchEvent(new Event("change"));
            } else {
              throw new Error(
                "Input element 'input group' not found for key: " + key
              );
            }
          } else if (
            inputElement == document.querySelector(`[name*="data[${key}]"][`)
            // if the input element is a radio button or checkbox
          ) {
            let inputToClick = document.querySelector(
              `[name*="data[${key}]"][id*="${value}"]`
            );
            if (inputToClick) {
              inputToClick.click();
            } else {
              throw new Error(
                "Input element 'value' not found for key: " + key
              );
            }
          } else {
            // if the input element is a text field or select
            inputElement.value = value;
            inputElement.dispatchEvent(new Event("input")); // Trigger change event
            inputElement.dispatchEvent(new Event("change"));
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
                inputElement.value = value;
                inputElement.dispatchEvent(new Event("input"));
                inputElement.dispatchEvent(new Event("change"));
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
  const data = formData[0];
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
    let continueButton = document.querySelector("[name='data[next1]']");
    if (continueButton) {
      continueButton.click();
    }
    function checkPageChanged(observer) {
      let pageSpan = document.querySelector(
        ".usa-step-indicator__current-step"
      );
      if (pageSpan) {
        let pageNumber = Number(pageSpan.textContent.trim());
        if (pageNumber === 2) {
          observer.disconnect();
          entryFormPage2(data);
        }
      }
    }
    const observer = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList" || mutation.type === "attributes") {
          checkPageChanged(observer);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });
    checkPageChanged(observer);
  }
}
function entryFormPage2(formData) {
  const data = formData[1];
  console.log("entryFormPage2", data);
}
