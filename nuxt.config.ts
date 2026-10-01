// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  modules: ["@nuxt/ui"],

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

  devtools: { enabled: true },
});
