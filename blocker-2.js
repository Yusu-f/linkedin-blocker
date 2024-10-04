console.log("blocker two running");

const blockUser = async () => {
  try {
    console.log("Blocking user");
    const moreButton = await waitFor(() =>
      document.querySelector("button[aria-label='More actions']"), 10000
    );
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds

    moreButton.click();

    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 2 seconds

    const reportOrBlockOption = await waitFor(() =>
      document.querySelector("div[aria-label*='Report or block']")
    ); 
    reportOrBlockOption.click();

    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 2 seconds

    let blockbtn = await waitFor(() =>
      getElementByTextContent("strong", "Block", true)
    );
    blockbtn.click();

    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 2 seconds

    blockbtn = await waitFor(() => getElementByTextContent("span", "Block"));
    blockbtn.click();

    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 2 seconds

    const confirmBlock = await waitFor(() =>
      getElementByTextContent(
        "p",
        "The blocked member won’t receive any notification on this action."
      )
    );
    if (confirmBlock) {
      return Promise.resolve(true);
    }
  } catch (error) {
    console.log(error);
  }
};

blockUser();
