// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@unocss/nuxt", "@nuxt/devtools", "@element-plus/nuxt", "@sidebase/nuxt-auth", "@vueuse/nuxt"],
  auth: {
    provider: {
      type: "authjs",
    },
    // globalAppMiddleware: true,
  },
  build: {
    transpile: ["trpc-nuxt", "next-auth/providers/identity-server4"],
  },
  elementPlus: {},
  devtools: {
    // Enable devtools (default: true)
    enabled: true,
    // VS Code Server options
    vscode: {},
    // ...other options
  },
  typescript: {
    // strict: false,
    // shim: false,
  },
  runtimeConfig: {},
});
