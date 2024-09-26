let isThemeActive = false;
let currentTab;

chrome.storage.local.get("themeActive", (result) => {
  if (result.themeActive) {
    isThemeActive = true;
    document.getElementById("toggleTheme").textContent = "Desactiver le theme";

    applyTheme();
  }
});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  currentTab = tabs[0];

  document.getElementById("toggleTheme").addEventListener("click", function () {
    if (isThemeActive) {
      removeTheme();
    } else {
      applyTheme();
    }
    isThemeActive = !isThemeActive;

    chrome.storage.local.set({ themeActive: isThemeActive });
  });
});

function applyTheme() {
  chrome.scripting
    .insertCSS({
      target: { tabId: currentTab.id },
      files: ["style.css"],
    })
    .then(() => {
      document.getElementById("toggleTheme").textContent =
        "Desactiver le theme";
    })
    .catch((error) =>
      console.error("Erreur lors de l'injection du CSS : ", error)
    );
}

function removeTheme() {
  chrome.scripting
    .removeCSS({
      target: { tabId: currentTab.id },
      files: ["style.css"],
    })
    .then(() => {
      document.getElementById("toggleTheme").textContent = "Activer le theme";
    })
    .catch((error) =>
      console.error("Erreur lors de la suppression du CSS : ", error)
    );
}
