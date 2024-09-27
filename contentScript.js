let currentTheme = null;
let themeActive = false;

function initializeTheme() {
  chrome.storage.sync.get(["themeActive", "currentTheme"], (data) => {
    themeActive = data.themeActive;
    currentTheme = data.currentTheme;

    if (themeActive && currentTheme) {
      injectCSS(currentTheme);
    }
  });
}

initializeTheme();

function injectCSS(themeName) {
  chrome.runtime.sendMessage({ action: "injectCSS", themeName: themeName });
  if (!document.getElementById(`${themeName}-corner-top-left`)) {
    addThemeCornerImages(themeName);
  }
}

function removeCSS(themeName) {
  chrome.runtime.sendMessage({ action: "removeCSS", themeName: themeName });
  removeThemeCornerImages(themeName);
}

function addThemeCornerImages(theme) {
  const images = [
    {
      id: `${theme}-corner-top-left`,
      position: { top: "10px", left: "10px" },
      src: chrome.runtime.getURL(`images/${theme}1.png`),
    },
    {
      id: `${theme}-corner-top-right`,
      position: { top: "10px", right: "10px" },
      src: chrome.runtime.getURL(`images/${theme}2.png`),
    },
    {
      id: `${theme}-corner-bottom-left`,
      position: { bottom: "10px", left: "10px" },
      src: chrome.runtime.getURL(`images/${theme}3.png`),
    },
    {
      id: `${theme}-corner-bottom-right`,
      position: { bottom: "10px", right: "10px" },
      src: chrome.runtime.getURL(`images/${theme}4.png`),
    },
  ];

  images.forEach((imgInfo) => {
    let div = document.createElement("div");
    div.id = imgInfo.id;
    div.style.position = "fixed";
    div.style.zIndex = "2000";
    div.style.pointerEvents = "none";
    div.style.width = "80px";
    div.style.height = "80px";
    div.style.opacity = "0.5";
    div.style.backgroundImage = `url(${imgInfo.src})`;
    div.style.backgroundSize = "contain";
    div.style.backgroundRepeat = "no-repeat";
    div.style.backgroundPosition = "center";
    Object.assign(div.style, imgInfo.position);
    document.body.appendChild(div);
  });
}

function removeThemeCornerImages(theme) {
  const ids = [
    `${theme}-corner-top-left`,
    `${theme}-corner-top-right`,
    `${theme}-corner-bottom-left`,
    `${theme}-corner-bottom-right`,
  ];
  ids.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.remove();
    }
  });
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync") {
    if (changes.themeActive) {
      themeActive = changes.themeActive.newValue;

      if (themeActive) {
        if (currentTheme) {
          injectCSS(currentTheme);
        }
      } else {
        if (currentTheme) {
          removeCSS(currentTheme);
        }
      }
    }

    if (changes.currentTheme) {
      const oldTheme = changes.currentTheme.oldValue;
      const newTheme = changes.currentTheme.newValue;
      currentTheme = newTheme;

      if (themeActive) {
        if (oldTheme) {
          removeCSS(oldTheme);
        }
        if (newTheme) {
          injectCSS(newTheme);
        }
      }
    }
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggleTheme") {
    themeActive = message.themeActive;

    if (themeActive && currentTheme) {
      injectCSS(currentTheme);
    } else if (currentTheme) {
      removeCSS(currentTheme);
    }
  } else if (message.action === "changeTheme") {
    const newTheme = message.themeName;
    if (themeActive) {
      if (currentTheme) {
        removeCSS(currentTheme);
      }
      currentTheme = newTheme;
      injectCSS(newTheme);
    } else {
      currentTheme = newTheme;
    }
  }
});
