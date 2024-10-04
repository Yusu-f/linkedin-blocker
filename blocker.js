console.log("blocker js running");

let maxPages;
let curentPage = 1;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "setPages") {
    console.log("number of pages to block:", message.pages);
    maxPages = message.pages;
    blockUsers();
  }
});

const navigateToUrl = (url) => {
  return new Promise(async (resolve, reject) => {
    const response = await chrome.runtime.sendMessage({
      action: "navigate",
      url: url,
    });

    if (response.status === "success") {
      console.log("received response");
      resolve(response.message);
    } else {
      reject(new Error(response.message));
    }
  });
};

const blockUsers = async () => {
  let links = [];

  await waitFor(() => {
    links = document.querySelectorAll(
      "span.entity-result__title-text.t-16 > a.app-aware-link"
    );
    const noResults = document.querySelector(
      "div[data-view-name='search-results-no-results']"
    );
    if (links.length > 0 || noResults) return true;
    return false;
  }, 0);

  if (links.length == 0) {
    console.log("no profiles found");
    return;
  }

  let profileUrls = Array.from(links)
    .map((link) => link.href)
    .filter((href) => href.startsWith("https://www.linkedin.com/in/"));

  console.log("array:", profileUrls);
  await new Promise((resolve) => setTimeout(resolve, 2000));

  for (let i = 0; i < profileUrls.length; i++) {
    const url = profileUrls[i];
    try {
      await navigateToUrl(url);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.log(error);
      return;
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds
  gotoNextPage();
};

const gotoNextPage = async () => {
  if (maxPages != 0 && curentPage == maxPages) return;
  try {
    const nextButton = await waitFor(
      () => document.querySelector("button.artdeco-pagination__button--next"),
      0
    );
    nextButton.click();
    curentPage += 1;
    blockUsers();
  } catch (error) {
    console.log(error);
    return;
  }
};
