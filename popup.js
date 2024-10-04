// chrome.storage.sync.get(["linkedinBlocker_maxPages"], function (result) {
//   console.log("Value currently is " + result.linkedinBlocker_maxPages);
//   document.getElementById("pages-input").value =
//     result.linkedinBlocker_maxPages;
// });

// document.getElementById("blockBtn").addEventListener("click", () => {
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     chrome.scripting.executeScript(
//       {
//         target: { tabId: tabs[0].id },
//         files: ["utils/utils.js", "blocker.js"],
//       },
//       (injectionResults) => {
//         console.log("injection results");
//         if (chrome.runtime.lastError) {
//           console.error("Error injecting script:", chrome.runtime.lastError);
//         } else {
//           chrome.tabs.sendMessage(tabs[0].id, {
//             action: "setPages",
//             pages: +document.getElementById("pages-input").value,
//           });
//           console.log("Script injected successfully");
//         }
//       }
//     );
//   });
// });

document.getElementById("blockBtn").addEventListener("click", () => {
  chrome.runtime.sendMessage({
    action: "startBlocking",
    pages: +document.getElementById("pages-input").value
  });
});

