// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  modules: ["@nuxt/ui"],

  css: ["~/assets/css/main.css"],

  components: [{ path: "~/components", pathPrefix: false }],

  runtimeConfig: {
    public: {
      appwriteEndpoint: "",
      appwriteProjectId: "",
    },
  },

  devtools: { enabled: true },
});
