// form link: https://www.pay.gov/public/form/start/704509645
let dealId;
let formId;
chrome.runtime.sendMessage({ action: "ready" });
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "startAutoFill" && dealId) {
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
      [
        { key: "PII_OrgType", value: "Corporation" },
        { key: "PII_IncorporatedDate", value: "04/11/2024" },
        { key: "PII_IncorporatedState", value: "New York" },
        { key: "Part2Item4", value: "1" },
        { key: "Part2Item5", value: "1" },
      ],
      [
        { key: "Part3Item1", value: "1" },
        { key: "PII_Part3Item1Detail", value: "ppapw" },
        { key: "Part3Item2", value: "1" },
        { key: "PII_Part3Item2Detail", value: "odood" },
      ],
      [
        {
          key: "PII_Part4Item1",
          value: `asdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasud`,
        },
      ],
      [
        { key: "PII_NTEECode", value: "A01" },
        { key: "AssignNTEE", value: "false" },
        { key: "Part4Item3", value: "1" },
        {
          key: "PII_Part4Item3Description",
          value: `asdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasud`,
        },
        { key: "Part4Item4", value: "1" },
        {
          key: "PII_Part4Item4Description",
          value: `asdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasud`,
        },
        { key: "Part4Item5", value: "1" },
        {
          key: "PII_Part4Item5Description",
          value: `asdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasud`,
        },
        { key: "Part4Item6", value: "1" },
        {
          key: "PII_Part4Item6Description",
          value: `asdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasud`,
        },
        { key: "Part4Item6a", value: "1" },
        { key: "Part4Item7", value: "1" },
        {
          key: "PII_Part4Item7Description",
          value: `asdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasud`,
        },
        { key: "Part4Item8", value: "1" },
        {
          key: "PII_Part4Item8Description",
          value: `asdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasud`,
        },
        { key: "Part4Item9", value: "1" },
        {
          key: "PII_Part4Item9Description",
          value: `asdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasud`,
        },
        { key: "Part4Item9a", value: "1" },
        {
          key: "PII_Part4Item9aDescription",
          value: `asdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasud`,
        },
        { key: "Part4Item9b", value: "1" },
        {
          key: "PII_Part4Item9bDescription",
          value: `asdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasud`,
        },
        { key: "Part4Item9c", value: "1" },
        {
          key: "PII_Part4Item9cDescription",
          value: `asdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasud`,
        },
        { key: "Part4Item9d", value: "1" },
        {
          key: "PII_Part4Item9dDescription",
          value: `asdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasud`,
        },
        { key: "Part4Item9e", value: "1" },
        {
          key: "PII_Part4Item9eDescription",
          value: `asdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasud`,
        },
        { key: "Part4Item9f", value: "1" },
        {
          key: "PII_Part4Item9fDescription",
          value: `asdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasud`,
        },
        { key: "Part4Item9g", value: "1" },
        {
          key: "PII_Part4Item9gDescription",
          value: `asdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasud`,
        },
        { key: "Part4Item9h", value: "1" },
        { key: "Part4Item9i", value: "1" },
        { key: "Part4Item10", value: "1" },
        {
          key: "PII_Part4Item10Description",
          value: `asdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasud`,
        },
        { key: "Part4Item10a", value: "1" },
        {
          key: "PII_Part4Item10aDescription",
          value: `asdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasud`,
        },
        { key: "Part4Item10b", value: "1" },
        { key: "Part4Item10c", value: "1" },
        { key: "Part4Item11", value: "1" },
        {
          key: "PII_Part4Item11Description",
          value: `asdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasud`,
        },
        { key: "Part4Item12", value: "1" },
        { key: "Part4Item13", value: "1" },
        { key: "Part4Item14", value: "1" },
        { key: "Part4Item15", value: "1" },
        { key: "Part4Item16Website", value: "1" },
        { key: "Part4Item16FoundationGrant", value: "1" },
        { key: "Part4Item16OtherOrg", value: "1" },
        { key: "Part4Item16Bingo", value: "1" },
        { key: "Part4Item16OtherGame", value: "1" },
        { key: "Part4Item16Other", value: "1" },
        {
          key: "Part4Item16OtherDescription",
          value: `asdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd`,
        },
        { key: "NoFundraising", value: "0" },
        { key: "Part4Item17", value: "1" },
        {
          key: "PII_Part4Item17Description",
          value: `asdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasudasdjhhwdkuahd jahdjhasdwkad hbasdkhwadjhbasud`,
        },
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
          entryFormPage(data);
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
