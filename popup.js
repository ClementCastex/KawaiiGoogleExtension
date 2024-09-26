document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("toggleTheme");
  const kawaiiButton = document.getElementById("kawaiiTheme");
  const sunsetButton = document.getElementById("sunsetTheme");
  const darkButton = document.getElementById("darkTheme");
  const themeButtons = [kawaiiButton, sunsetButton, darkButton];

  chrome.storage.sync.get(["themeActive", "currentTheme"], function (data) {
    if (data.themeActive) {
      toggleButton.textContent = "Désactiver le Thème";
    } else {
      toggleButton.textContent = "Activer le Thème";
    }
    updateThemeButtons(data.currentTheme);
  });

  toggleButton.addEventListener("click", function () {
    chrome.storage.sync.get("themeActive", function (data) {
      const newThemeActive = !data.themeActive;
      chrome.storage.sync.set({ themeActive: newThemeActive });

      if (newThemeActive) {
        toggleButton.textContent = "Désactiver le Thème";
      } else {
        toggleButton.textContent = "Activer le Thème";
      }

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "toggleTheme",
          themeActive: newThemeActive,
        });
      });
    });
  });

  kawaiiButton.addEventListener("click", function () {
    setTheme("kawaii");
    updateThemeButtons("kawaii");
  });

  sunsetButton.addEventListener("click", function () {
    setTheme("sunset");
    updateThemeButtons("sunset");
  });

  darkButton.addEventListener("click", function () {
    setTheme("dark");
    updateThemeButtons("dark");
  });

  function setTheme(themeName) {
    chrome.storage.sync.set({ currentTheme: themeName }, function () {
      chrome.storage.sync.get("themeActive", function (data) {
        if (data.themeActive) {
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              chrome.tabs.sendMessage(tabs[0].id, {
                action: "changeTheme",
                themeName: themeName,
              });
            }
          );
        }
      });
    });
  }

  function updateThemeButtons(selectedTheme) {
    themeButtons.forEach(function (button) {
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
