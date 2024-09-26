document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("toggleTheme");
  const kawaiiButton = document.getElementById("kawaiiTheme");
  const sunsetButton = document.getElementById("sunsetTheme");
  const darkButton = document.getElementById("darkTheme");
  const themeButtons = [kawaiiButton, sunsetButton, darkButton];

  // Récupérer l'état actuel du thème depuis le stockage
  chrome.storage.sync.get(["themeActive", "currentTheme"], (data) => {
    if (data.themeActive) {
      toggleButton.textContent = "Désactiver le Thème";
    } else {
      toggleButton.textContent = "Activer le Thème";
    }

    // Mettre à jour l'apparence des boutons de thème
    updateThemeButtons(data.currentTheme);
  });

  toggleButton.addEventListener("click", () => {
    chrome.storage.sync.get("themeActive", (data) => {
      const newThemeActive = !data.themeActive;
      chrome.storage.sync.set({ themeActive: newThemeActive });

      if (newThemeActive) {
        toggleButton.textContent = "Désactiver le Thème";
      } else {
        toggleButton.textContent = "Activer le Thème";
      }

      // Envoyer un message pour appliquer ou retirer le thème
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "toggleTheme", themeActive: newThemeActive },
          () => {
            // Recharger la page pour appliquer le thème
            chrome.tabs.reload(tabs[0].id);
          }
        );
      });
    });
  });

  kawaiiButton.addEventListener("click", () => {
    setTheme("kawaii");
    updateThemeButtons("kawaii");
  });

  sunsetButton.addEventListener("click", () => {
    setTheme("sunset");
    updateThemeButtons("sunset");
  });

  darkButton.addEventListener("click", () => {
    setTheme("dark");
    updateThemeButtons("dark");
  });

  function setTheme(themeName) {
    chrome.storage.sync.set({ currentTheme: themeName }, () => {
      // Si le thème est activé, on l'applique immédiatement
      chrome.storage.sync.get("themeActive", (data) => {
        if (data.themeActive) {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(
              tabs[0].id,
              { action: "changeTheme", themeName: themeName },
              () => {
                // Recharger la page pour appliquer le thème
                chrome.tabs.reload(tabs[0].id);
              }
            );
          });
        }
      });
    });
  }

  function updateThemeButtons(selectedTheme) {
    themeButtons.forEach((button) => {
      if (button.id === selectedTheme + "Theme") {
        button.classList.add("selected");
        button.disabled = true;
      } else {
        button.classList.remove("selected");
        button.disabled = false;
      }
    });
  }
});
