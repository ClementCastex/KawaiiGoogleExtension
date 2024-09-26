// background.js

// Fonction pour injecter le script de contenu dans tous les onglets
function injectContentScriptIntoAllTabs() {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      // Vérifier si l'URL correspond aux sites où vous voulez injecter le script
      if (tab.url && tab.url.startsWith("http")) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            files: ["contentScript.js"],
          },
          () => {
            // Vous pouvez gérer les erreurs ici si nécessaire
          }
        );
      }
    }
  });
}

// Événement déclenché lorsque l'extension démarre
chrome.runtime.onStartup.addListener(() => {
  injectContentScriptIntoAllTabs();
});

// Événement déclenché lorsque l'extension est installée ou mise à jour
chrome.runtime.onInstalled.addListener(() => {
  injectContentScriptIntoAllTabs();
});

// Votre code existant pour gérer les messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "injectCSS") {
    chrome.scripting.insertCSS({
      target: { tabId: sender.tab.id },
      files: [`${message.themeName}.css`],
    });
  } else if (message.action === "removeCSS") {
    chrome.scripting.removeCSS({
      target: { tabId: sender.tab.id },
      files: [`${message.themeName}.css`],
    });
  }
});
