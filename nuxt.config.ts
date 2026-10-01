// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  modules: ["@nuxt/ui", "@nuxtjs/i18n"],

  css: ["~/assets/css/main.css"],

  components: [{ path: "~/components", pathPrefix: false }],

  runtimeConfig: {
    appwriteApiKey: "",

    appwriteDatabaseId: "",
    appwriteTripsTableId: "",

    appwriteChecklistGroupsTableId: "",
    appwriteChecklistItemsTableId: "",

    appwriteTransportTableId: "",
    appwriteAccommodationsTableId: "",

    public: {
      appwriteEndpoint: "",
      appwriteProjectId: "",
    },
  },

  i18n: {
    vueI18n: "./i18n.config.ts",
    strategy: "no_prefix",
    defaultLocale: "en",

    locales: [
      {
        code: "en",
        name: "English",
        language: "en-US",
        file: "en.json",
      },
      {
        code: "ru",
        name: "Русский",
        language: "ru-RU",
        file: "ru.json",
      },
    ],

    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "tripkit-locale",
    },
  },

  devtools: { enabled: true },
});
