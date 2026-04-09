/* =========================================================
   FINDPATIENT — CLEAN, CONFIG‑DRIVEN (SITES VERSION)
   ========================================================= */

/* ------------------------------
   0. CONFIG + STATE
   ------------------------------ */

const cfg = window.findpatientConfig;

let currentSiteKey = null;
let currentLocationName = null;
let currentToolKey = "tracking";

const dom = {
  desktopContainer: null,
  mobileContainer: null,

  toolsButton: null,
  toolsMenu: null,
  activeToolLabel: null,

  siteButton: null,
  siteMenu: null,
  activeSite: null,

  locationButton: null,
  locationMenu: null,
  activeLocation: null,

  timestamp: null,
  loadingSpinner: null,
  iframe: null,
  selectorRow: null,

  footerAuthor: null,
  appVersion: null,

  appLogo: null,
  appLogoFallback: null,
  dynamicFavicon: null,
  dynamicTitle: null
};

/* ------------------------------
   1. DOM BINDING
   ------------------------------ */

function bindDom() {
  dom.desktopContainer =
    document.getElementById("desktopContainer") ||
    document.getElementById("mainContent");
  dom.mobileContainer = document.getElementById("mobileContainer");

  dom.toolsButton = document.getElementById("toolsButton");
  dom.toolsMenu = document.getElementById("toolsMenu");
  dom.activeToolLabel = document.getElementById("activeToolLabel");

  dom.siteButton = document.getElementById("siteButton");
  dom.siteMenu = document.getElementById("siteMenu");
  dom.activeSite = document.getElementById("activeSite");

  dom.locationButton = document.getElementById("locationButton");
  dom.locationMenu = document.getElementById("locationMenu");
  dom.activeLocation = document.getElementById("activeLocation");

  dom.timestamp = document.getElementById("timestamp");
  dom.loadingSpinner = document.getElementById("loadingSpinner");
  dom.iframe = document.getElementById("dashboardFrame");
  dom.selectorRow = document.getElementById("selectorRow");

  dom.footerAuthor = document.getElementById("footerAuthor");
  dom.appVersion = document.getElementById("appVersion");

  dom.appLogo = document.getElementById("appLogo");
  dom.appLogoFallback = document.getElementById("appLogoFallback");
  dom.dynamicFavicon = document.getElementById("dynamicFavicon");
  dom.dynamicTitle = document.getElementById("dynamicTitle");
}

/* ------------------------------
   2. BRANDING + ORG METADATA
   ------------------------------ */

function applyBranding() {
  if (!cfg || !cfg.branding) return;

  const mode = cfg.branding.brandingMode;
  const themes = cfg.branding.themes || {};
  const theme = themes[mode];
  if (!theme) return;

  document.querySelectorAll(".appTitle").forEach(el => {
    el.textContent = theme.appName;
  });
  if (dom.dynamicTitle) dom.dynamicTitle.textContent = theme.appName;

  if (theme.logo && dom.appLogo && dom.appLogoFallback) {
    dom.appLogo.src = theme.logo;

    dom.appLogo.onload = () => {
      dom.appLogo.style.display = "block";
      dom.appLogoFallback.style.display = "none";
    };

    dom.appLogo.onerror = () => {
      dom.appLogo.style.display = "none";
      dom.appLogoFallback.style.display = "block";
      dom.appLogoFallback.textContent = theme.appName || cfg.org.code;
      dom.appLogoFallback.style.color = theme.background;
    };
  } else if (dom.appLogo && dom.appLogoFallback) {
    dom.appLogo.style.display = "none";
    dom.appLogoFallback.style.display = "block";
    dom.appLogoFallback.textContent = theme.appName || cfg.org.code;
  }

  if (theme.favicon && dom.dynamicFavicon) {
    dom.dynamicFavicon.href = theme.favicon;
  }

  const root = document.documentElement;
  root.style.setProperty("--primary-colour", theme.primary);
  root.style.setProperty("--secondary-colour", theme.secondary);
  root.style.setProperty("--accent-colour", theme.accent);
  root.style.setProperty("--background-colour", theme.background);
  root.style.setProperty("--danger-colour", theme.danger);
  root.style.setProperty("--success-colour", theme.success);
}

function applyOrgMetadata() {
  if (!cfg || !cfg.org) return;

  if (dom.dynamicTitle) dom.dynamicTitle.textContent = cfg.org.appTitle;
  document.querySelectorAll(".appTitle").forEach(el => {
    el.textContent = cfg.org.appTitle;
  });

  if (dom.appVersion) dom.appVersion.textContent = `${cfg.org.code} ${cfg.org.version}`;
  if (dom.footerAuthor) dom.footerAuthor.textContent = cfg.org.name;
}

/* ------------------------------
   3. MOBILE MODE
   ------------------------------ */

function detectMobileMode() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("mobile") === "1") return true;
  if (params.get("mobile") === "0") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function applyMobileMode() {
  const mobile = detectMobileMode();

  if (mobile) {
    if (dom.desktopContainer) dom.desktopContainer.style.display = "none";
    if (dom.mobileContainer) dom.mobileContainer.style.display = "block";
    if (dom.timestamp) dom.timestamp.style.display = "none";

    buildMobileMenu();
    buildMobileSiteSelector();
  } else {
    if (dom.desktopContainer) dom.desktopContainer.style.display = "block";
    if (dom.mobileContainer) dom.mobileContainer.style.display = "none";
  }
}

/* ------------------------------
   4. TOOLS MENU
   ------------------------------ */

function buildToolsMenu() {
  if (!dom.toolsMenu || !cfg || !cfg.tools) return;
  dom.toolsMenu.innerHTML = "";

  cfg.tools.forEach(tool => {
    if (!tool.enabled) return;

    const item = document.createElement("div");
    item.textContent = tool.label;
    item.dataset.toolKey = tool.key;

    item.onclick = () => {
      if (tool.type === "action") {
        manualRefresh();
      } else {
        selectTool(tool.key);
      }
    };

    dom.toolsMenu.appendChild(item);
  });
}

/* ------------------------------
   5. SITES + LOCATIONS
   ------------------------------ */

function buildSiteMenu() {
  if (!dom.siteMenu || !cfg || !cfg.sites) return;
  dom.siteMenu.innerHTML = "";

  Object.entries(cfg.sites).forEach(([key, site]) => {
    const item = document.createElement("div");
    item.textContent = site.name;
    item.dataset.siteKey = key;

    item.onclick = () => selectSite(key);

    dom.siteMenu.appendChild(item);
  });
}

function buildLocationMenu(siteKey) {
  if (!dom.locationMenu || !cfg || !cfg.sites) return;
  dom.locationMenu.innerHTML = "";

  const site = cfg.sites[siteKey];
  if (!site) return;

  site.locations.forEach(loc => {
    const item = document.createElement("div");
    item.textContent = loc.name;

    if (!loc.enabled) {
      item.style.opacity = "0.4";
      item.style.pointerEvents = "none";
    } else {
      item.onclick = () => selectLocation(loc.name);
    }

    dom.locationMenu.appendChild(item);
  });
}

/* ------------------------------
   6. SELECTION HANDLERS
   ------------------------------ */

function selectTool(toolKey) {
  currentToolKey = toolKey;

  const tool = cfg.tools.find(t => t.key === toolKey);
  if (!tool) return;

  if (tool.type === "action") {
    manualRefresh();
    return;
  }

  if (dom.activeToolLabel) {
    dom.activeToolLabel.textContent = tool.label;
  }

  if (dom.toolsMenu) {
    dom.toolsMenu.querySelectorAll("div").forEach(div => {
      div.classList.toggle("active", div.dataset.toolKey === toolKey);
    });
  }

  if (toolKey === "tracking") {
    if (dom.selectorRow) dom.selectorRow.style.display = "flex";
    if (dom.timestamp) dom.timestamp.style.display = "block";
    loadTrackingBoard();
  } else {
    if (dom.selectorRow) dom.selectorRow.style.display = "none";
    if (dom.timestamp) dom.timestamp.style.display = "none";
    loadToolIframe(toolKey);
  }
}

function selectSite(siteKey) {
  currentSiteKey = siteKey;

  const site = cfg.sites[siteKey];
  if (site && dom.activeSite) {
    dom.activeSite.textContent = site.name;
  }

  buildLocationMenu(siteKey);

  const firstEnabled = site.locations.find(l => l.enabled);
  if (firstEnabled) selectLocation(firstEnabled.name);

  if (currentToolKey === "tracking") loadTrackingBoard();
}

function selectLocation(locationName) {
  currentLocationName = locationName;

  if (dom.activeLocation) {
    dom.activeLocation.textContent = locationName;
  }

  if (currentToolKey === "tracking") loadTrackingBoard();
}

/* ------------------------------
   7. IFRAME LOADING
   ------------------------------ */

function loadTrackingBoard() {
  if (!currentSiteKey || !currentLocationName) return;
  if (!cfg || !cfg.dashboards) return;

  const siteDashboards = cfg.dashboards[currentSiteKey];
  if (!siteDashboards) return;

  const url = siteDashboards[currentLocationName];
  if (!url) return;

  loadIframe(url, true);
}

function loadToolIframe(toolKey) {
  if (!cfg || !cfg.toolUrls) return;
  const url = cfg.toolUrls[toolKey];
  if (!url) return;
  loadIframe(url, false);
}

function loadIframe(url, isTracking) {
  if (!dom.iframe || !url) return;

  if (dom.loadingSpinner) {
    dom.loadingSpinner.style.display = "block";
  }

  dom.iframe.classList.toggle("iframeTracking", !!isTracking);
  dom.iframe.classList.toggle("iframeForm", !isTracking);

  dom.iframe.src = `${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`;

  dom.iframe.onload = () => {
    if (dom.loadingSpinner) {
      dom.loadingSpinner.style.display = "none";
    }
    updateTimestamp();
  };
}

function updateTimestamp() {
  if (!dom.timestamp) return;
  if (currentToolKey !== "tracking") return;

  dom.timestamp.textContent =
    "Last refreshed at " +
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
}

/* ------------------------------
   8. AUTO + MANUAL REFRESH
   ------------------------------ */

setInterval(() => {
  if (currentToolKey !== "tracking") return;
  loadTrackingBoard();
}, 300000);

function manualRefresh() {
  if (currentToolKey !== "tracking") return;
  if (!dom.activeToolLabel) return;

  dom.activeToolLabel.classList.add("refreshing");
  dom.activeToolLabel.textContent = "Refreshing…";

  loadTrackingBoard();

  setTimeout(() => {
    dom.activeToolLabel.classList.remove("refreshing");
    dom.activeToolLabel.textContent = "Tracking Board";
  }, 800);
}

/* ------------------------------
   9. MOBILE VERSION
   ------------------------------ */

function buildMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  if (!menu || !cfg || !cfg.tools) return;

  menu.innerHTML = "";

  cfg.tools.forEach(tool => {
    if (!tool.enabled) return;

    const btn = document.createElement("button");
    btn.className = "siteButton";
    btn.textContent = tool.label;

    btn.onclick = () => {
      const url = cfg.toolUrls[tool.key];
      if (url) window.location.href = url;
    };

    menu.appendChild(btn);
  });
}

function buildMobileSiteSelector() {
  const container = document.getElementById("siteSelector");
  if (!container || !cfg || !cfg.sites || !cfg.dashboards) return;

  container.innerHTML = "<h2>Select Site</h2>";

  Object.entries(cfg.sites).forEach(([key, site]) => {
    const btn = document.createElement("button");
    btn.className = "siteButton";
    btn.textContent = site.name;

    btn.onclick = () => {
      const url = cfg.dashboards[key]["Whole Dept"];
      if (url) window.location.href = url;
    };

    container.appendChild(btn);
  });

  const back = document.createElement("div");
  back.className = "backLink";
  back.textContent = "← Back";
  back.onclick = () => {
    container.style.display = "none";
    const menu = document.getElementById("mobileMenu");
    if (menu) menu.style.display = "block";
  };

  container.appendChild(back);
}

/* ------------------------------
   10. DROPDOWN ENGINE
   ------------------------------ */

function bindDropdowns() {
  const triggers = document.querySelectorAll(".dropdownTrigger");

  triggers.forEach(trigger => {
    trigger.addEventListener("click", e => {
      e.stopPropagation();

      document.querySelectorAll(".dropdownList.open").forEach(menu => {
        if (!trigger.contains(menu)) menu.classList.remove("open");
      });

      const menu = trigger.querySelector(".dropdownList");
      if (menu) menu.classList.toggle("open");
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".dropdownList.open").forEach(menu => {
      menu.classList.remove("open");
    });
  });
}

/* ------------------------------
   11. INIT
   ------------------------------ */

function initApp() {
  bindDom();
  applyOrgMetadata();
  applyBranding();
  applyMobileMode();

  buildToolsMenu();
  buildSiteMenu();
  bindDropdowns();

  const firstSiteKey = Object.keys(cfg.sites)[0];
  selectSite(firstSiteKey);
  selectTool("tracking");
}

document.addEventListener("DOMContentLoaded", initApp);
