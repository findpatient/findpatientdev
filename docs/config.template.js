/* =========================================================
   FINDPATIENT — MULTI‑ORG CONFIG TEMPLATE
   ========================================================= */

window.findpatientConfig = {

  /* ------------------------------
     1. ORG METADATA
     ------------------------------ */
  org: {
    name: "Your Organisation Name",
    code: "ORG",
    version: "v1.0.0",
    appTitle: "Clinical Dashboard"
  },

  /* ------------------------------
     2. BRANDING ENGINE (3 MODES)
     ------------------------------ */
  branding: {
    // Options: "findpatient", "nhs", "org"
    brandingMode: "findpatient",

    themes: {
      /* ------------------------------
         FINDPATIENT THEME
         ------------------------------ */
      findpatient: {
        primary: "#005eb8",
        secondary: "#003087",
        accent: "#41b6e6",
        background: "#ffffff",
        danger: "#d4351c",
        success: "#00703c",

        logo: "assets/logo-findpatient.png",
        favicon: "assets/favicon-findpatient.ico",
        appName: "FindPatient"
      },

      /* ------------------------------
         NHS THEME
         ------------------------------ */
      nhs: {
        primary: "#005eb8",
        secondary: "#003087",
        accent: "#41b6e6",
        background: "#ffffff",
        danger: "#d4351c",
        success: "#00703c",

        logo: "https://assets.nhs.uk/images/nhs-logo.png",
        favicon: "assets/favicon-nhs.ico",
        appName: "NHS Dashboard"
      },

      /* ------------------------------
         ORG‑SPECIFIC THEME
         (Injected per deployment)
         ------------------------------ */
      org: {
        primary: "#004f7c",
        secondary: "#002f4c",
        accent: "#4fa3d1",
        background: "#ffffff",
        danger: "#d4351c",
        success: "#00703c",

        logo: "assets/logo-org.png",
        favicon: "assets/favicon-org.ico",
        appName: "Organisation Dashboard"
      }
    }
  },

  /* ------------------------------
     3. TOOLS (TOP MENU)
     ------------------------------ */
  tools: [
    { key: "tracking", label: "Tracking Board", enabled: true, type: "view" },
    { key: "referrals", label: "Referrals", enabled: true, type: "view" },
    { key: "forms", label: "Forms", enabled: true, type: "view" },
    { key: "refresh", label: "Refresh", enabled: true, type: "action" }
  ],

  /* ------------------------------
     4. TOOL URLS
     ------------------------------ */
  toolUrls: {
    tracking: "https://example.com/tracking",
    referrals: "https://example.com/referrals",
    forms: "https://example.com/forms"
  },

  /* ------------------------------
     5. SITES (formerly hospitals)
     ------------------------------ */
  sites: {
    siteA: {
      name: "Main Hospital",
      locations: [
        { name: "Whole Dept", enabled: true },
        { name: "Ward A", enabled: true },
        { name: "Ward B", enabled: false }
      ]
    },

    siteB: {
      name: "Community Clinic",
      locations: [
        { name: "Whole Dept", enabled: true },
        { name: "Outpatients", enabled: true }
      ]
    }
  },

  /* ------------------------------
     6. DASHBOARD URLS
     siteKey → locationName → URL
     ------------------------------ */
  dashboards: {
    siteA: {
      "Whole Dept": "https://example.com/dashboards/siteA/whole",
      "Ward A": "https://example.com/dashboards/siteA/wardA",
      "Ward B": "https://example.com/dashboards/siteA/wardB"
    },

    siteB: {
      "Whole Dept": "https://example.com/dashboards/siteB/whole",
      "Outpatients": "https://example.com/dashboards/siteB/outpatients"
    }
  }
};
