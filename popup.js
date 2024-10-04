document.getElementById("blockBtn").addEventListener("click", () => {
  chrome.runtime.sendMessage({
    action: "startBlocking",
    pages: +document.getElementById("pages-input").value
  });
});

