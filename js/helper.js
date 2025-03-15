function startFormPage() {
  let continueButton = document.querySelector("#continueButton");

  if (continueButton) {
    continueButton.click();
  }
}

function entryFormPage(formId) {
  // Sample JSON Data
  const formData = {
    PII_OrgName1: "Example Nonprofit Organization",
    PII_CareOfName: "John Doe",
    PII_Address: "123 Example Street",
    PII_City: "New York",
    PII_State: "NY",
    PII_Zip: "10001",
    PII_Country: "United States",
    sensEIN_1: "12-3456799",
    PII_AccountingPeriodEnd: 12,
    PII_PrimaryContactName: "Sarah Miller",
    PII_PrimaryContactPhone: "555-987-6543",
    PII_PrimaryContactFax: "555-111-2222",
    PII_OrgURL: "example.org",
    RemittanceNetAmount: "$600.00",
    Trustees: [
      {
        FirstName: "Emily",
        LastName: "Carter",
        Title: "President",
        StreetAddr: "456 Trustee Lane",
        City: "Los Angeles",
        State: "CA",
        ZIP: "90001",
      },
      {
        FirstName: "David",
        LastName: "White",
        Title: "Treasurer",
        StreetAddr: "789 Finance Road",
        City: "Chicago",
        State: "IL",
        ZIP: "60601",
      },
    ],
  };

  // Function to autofill form fields using the name attribute
  function autofillForm(data) {
    Object.keys(data).forEach((key) => {
      if (key !== "Trustees") {
        let inputElement = document.querySelector(`[name="data[${key}]"]`);
        if (inputElement) {
          inputElement.value = data[key];
          inputElement.dispatchEvent(new Event("input")); // Trigger change event
          inputElement.dispatchEvent(new Event("change")); // Trigger change event
        }
      }
    });

    // Set the number of trustees dynamically
    let trusteeSelect = document.querySelector(`[name="data[OfficerCount]"]`);
    if (trusteeSelect) {
      trusteeSelect.value = data.Trustees.length;
      trusteeSelect.dispatchEvent(new Event("input")); // Trigger change event
      trusteeSelect.dispatchEvent(new Event("change")); // Trigger change event
    }
  }

  // Function to autofill trustee fields dynamically
  function autofillTrustees(trustees) {
    trustees.forEach((trustee, index) => {
      let trusteeIndex = index + 1; // Trustee numbers start from 1

      let firstName = document.querySelector(
        `[name="data[PII_OfcrDirTrust${trusteeIndex}FirstName]"]`
      );
      let lastName = document.querySelector(
        `[name="data[PII_OfcrDirTrust${trusteeIndex}LastName]"]`
      );
      let title = document.querySelector(
        `[name="data[PII_OfcrDirTrust${trusteeIndex}Title]"]`
      );
      let address = document.querySelector(
        `[name="data[PII_OfcrDirTrust${trusteeIndex}StreetAddr]"]`
      );
      let city = document.querySelector(
        `[name="data[PII_OfcrDirTrust${trusteeIndex}City]"]`
      );
      let state = document.querySelector(
        `[name="data[PII_OfcrDirTrust${trusteeIndex}State]"]`
      );
      let zip = document.querySelector(
        `[name="data[PII_OfcrDirTrust${trusteeIndex}ZIP]"]`
      );

      if (firstName) firstName.value = trustee.FirstName;
      if (lastName) lastName.value = trustee.LastName;
      if (title) title.value = trustee.Title;
      if (address) address.value = trustee.StreetAddr;
      if (city) city.value = trustee.City;
      if (state) state.value = trustee.State;
      if (zip) zip.value = trustee.ZIP;
      [firstName, lastName, title, address, city, state, zip].forEach(
        (element) => {
          if (element) {
            element.dispatchEvent(new Event("input")); // Trigger input event
            element.dispatchEvent(new Event("change")); // Trigger change event
          }
        }
      );
    });
  }

  // Observer function to detect when trustee section updates
  function observeTrusteeChange() {
    let container = document.querySelector("#formio"); // Adjust selector if needed

    let observer = new MutationObserver(() => {
      autofillTrustees(formData.Trustees);
    });

    observer.observe(container, { childList: true, subtree: true });

    // Call autofillTrustees immediately after setting up the observer
    autofillTrustees(formData.Trustees);
  }

  autofillForm(formData);
  observeTrusteeChange();
}
