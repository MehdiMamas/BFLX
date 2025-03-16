// form link: https://www.pay.gov/public/form/start/704509645

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "startAutoFill") {
    const formLink = window.location.href;
    let formLinkData = formLink.split("/").filter((e) => e != "");
    formLinkData.reverse();
    const formId = formLinkData[0];
    formLinkData.reverse();
    const stage = formLinkData[4];
    const data = [
      [
        { key: "PII_OrgName1", value: "Example Nonprofit Organization" },
        { key: "PII_CareOfName", value: "John Doe" },
        { key: "PII_Address", value: "123 Example Street" },
        { key: "PII_City", value: "New York" },
        { key: "PII_Country", value: "United States" },
        { key: "PII_State", value: "NY" },
        { key: "PII_Zip", value: "10001" },
        { key: "sensEIN_1", value: "12-3456799" },
        { key: "PII_AccountingPeriodEnd", value: 12 },
        { key: "PII_PrimaryContactName", value: "Sarah Miller" },
        { key: "PII_PrimaryContactPhone", value: "555-987-6543" },
        { key: "PII_PrimaryContactFax", value: "555-111-2222" },
        { key: "PII_OrgURL", value: "example.org" },
        { key: "RemittanceNetAmount", value: "$600.00" },
        { key: "OfficerCount", value: 2 },
        { key: "PII_OfcrDirTrust1FirstName", value: "Emily" },
        { key: "PII_OfcrDirTrust1LastName", value: "Carter" },
        { key: "PII_OfcrDirTrust1Title", value: "President" },
        { key: "PII_OfcrDirTrust1StreetAddr", value: "456 Trustee Lane" },
        { key: "PII_OfcrDirTrust1City", value: "Los Angeles" },
        { key: "PII_OfcrDirTrust1State", value: "CA" },
        { key: "PII_OfcrDirTrust1ZIP", value: "90001" },
        { key: "PII_OfcrDirTrust2FirstName", value: "David" },
        { key: "PII_OfcrDirTrust2LastName", value: "White" },
        { key: "PII_OfcrDirTrust2Title", value: "Treasurer" },
        { key: "PII_OfcrDirTrust2StreetAddr", value: "789 Finance Road" },
        { key: "PII_OfcrDirTrust2City", value: "Chicago" },
        { key: "PII_OfcrDirTrust2State", value: "IL" },
        { key: "PII_OfcrDirTrust2ZIP", value: "60601" },
      ],
    ];
    switch (stage) {
      case "start":
        startFormPage();
        break;
      case "entry":
        let pageSpan = document.querySelector(
          ".usa-step-indicator__current-step"
        );
        if (pageSpan) {
          let pageNumber = Number(pageSpan.textContent.trim());
          switch (pageNumber) {
            case 1:
              entryFormPage1(data);
              break;
            case 2:
              entryFormPage2(data);
              break;
            case 3:
              entryFormPage3(data);
              break;
            case 4:
              entryFormPage4(data);
              break;
            case 5:
              entryFormPage5(data);
              break;
            case 6:
              entryFormPage6(data);
              break;
            case 7:
              entryFormPage7(data);
              break;
            case 8:
              entryFormPage8(data);
              break;
            case 9:
              entryFormPage9(data);
              break;
            case 10:
              entryFormPage10(data);
              break;
            case 11:
              entryFormPage11(data);
              break;
            case 12:
              entryFormPage12(data);
              break;
            default:
              break;
          }
        }
      default:
        break;
    }
  }
});
