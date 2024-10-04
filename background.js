console.log("background script running");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "navigate") {
    chrome.tabs.create({ url: request.url, active: false }, (tab) => {
      chrome.scripting
        .executeScript({
          target: { tabId: tab.id },
          files: ["utils/utils.js", "blocker-2.js"],
        })
        .then((res) => {
          if (res && res[0].result) {
            console.log("sending response");
            sendResponse({
              status: "success",
              message: "User blocked successfully",
            });
          } else {
            sendResponse({
              status: "error",
              message: "Script executed but no result returned",
            });
          }
          chrome.tabs.remove(tab.id, () => {
            console.log("Popup tab closed successfully");
          });
        })
        .catch((err) => {
          console.error("Error executing script:", err);
          sendResponse({ status: "error", message: "Error executing script" });
        });
    });
    return true;
  }

  if (request.action == "startBlocking") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;

      // Reload the current tab
      chrome.tabs.reload(tabId, {}, () => {
        // Wait for the tab to finish loading
        chrome.tabs.onUpdated.addListener(function listener(
          tabIdUpdated,
          changeInfo
        ) {
          if (tabIdUpdated === tabId && changeInfo.status === "complete") {
            // Once the tab has finished loading, inject the scripts
            chrome.scripting.executeScript(
              {
                target: { tabId: tabId },
                files: ["utils/utils.js", "blocker.js"],
              },
              (injectionResults) => {
                console.log("Injection results");
                if (chrome.runtime.lastError) {
                  console.error(
                    "Error injecting script:",
                    chrome.runtime.lastError
                  );
                } else {
                  chrome.tabs.sendMessage(tabId, {
                    action: "setPages",
                    pages: request.pages,
                  });
                  console.log("Script injected successfully");
                }
              }
            );

            // Remove the listener to prevent multiple injections
            chrome.tabs.onUpdated.removeListener(listener);
          }
        });
      });
    });
  }
});

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "nextpage") {
//   console.log("received nextpage msg");
//     chrome.scripting.executeScript({
//       target: { tabId: sender.tab.id },
//       files: ["blocker.js"],
//     });
//   }
// });
