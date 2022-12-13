// ==UserScript==
// @name         Wave - Save as CSV
// @version      0.2
// @description  Download the current table as a CSV file.
// @author       Jake Treacher
// @license      GNU GPLv3
// @namespace    https://github.com/jaketreacher
// @match        https://next.waveapps.com/*/transactions*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/jaketreacher/userscript-wave-csv/main/wave-csv.user
// @updateURL    https://raw.githubusercontent.com/jaketreacher/userscript-wave-csv/main/wave-csv.user
// ==/UserScript==

(() => {
  const ACTIONS_SELECTOR = "div.transactions-list-V2__header__actions";

  const generateCsv = () => {
    const data = [
      ...document.querySelector("tbody.wv-table__body").querySelectorAll("tr"),
    ].map((row) => {
      const date = row.querySelector(
        "td.transactions-list-v2__row__date-cell"
      ).innerText;
      const description = row.querySelector(
        "td.transactions-list-v2__row__description-cell"
      ).innerText;
      const category = row.querySelector(
        "td.transactions-list-v2__row__category-cell"
      ).innerText;
      const amount = row.querySelector(
        "td.transactions-list-v2__row__amount-cell"
      ).innerText;

      return [
        `\"${date}\"`,
        `\"${description}\"`,
        `\"${category}\"`,
        `\"${amount}\"`,
      ];
    });

    const csvContent = data.map((e) => e.join(",")).join("\n");

    const encodedUri =
      "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
    window.open(encodedUri);
  };

  const createButton = (parent_selector) => {
    let btn = document.createElement("BUTTON");

    btn.setAttribute("class", "wv-button");
    btn.innerText = "Generate CSV";
    btn.onclick = generateCsv;

    document.querySelector(parent_selector).appendChild(btn);
  };

  const waitForElement = (selector, callback) => {
    setTimeout(() => {
      let element = document.querySelector(selector);

      if (element) {
        createButton(selector);
      } else {
        waitForElement(selector, callback);
      }
    }, 1000);
  };

  window.addEventListener("load", () =>
    waitForElement(ACTIONS_SELECTOR, createButton)
  );
})();
