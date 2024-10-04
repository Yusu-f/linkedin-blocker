function waitFor(condition, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    function checkCondition() {
      const result = condition();
      if (result) {
        resolve(result);
      } else {
        const currentTime = Date.now();
        if (currentTime - startTime >= timeout && timeout != 0) {
          reject(new Error("Timeout exceeded while waiting for condition."));
        } else {
          setTimeout(checkCondition, 100);
        }
      }
    }

    checkCondition();
  });
}

const getElementByTextContent = (element, text, partial = false) => {
  var xpath = partial ? `//${element}[contains(text(),'${text}')]` : `//${element}[text()='${text}']`;
  var matchingElement = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
  return matchingElement;
};

const waitRandomTime = (minTime, maxTime) => {
  const min = minTime * 60 * 1000;
  const max = maxTime * 60 * 1000;
  const randomTime = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, randomTime));
};



