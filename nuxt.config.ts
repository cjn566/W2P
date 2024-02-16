// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    css: [
      '@/assets/styles/main.scss',      
      '@fortawesome/fontawesome-svg-core/styles.css',
      "primevue/resources/themes/lara-light-blue/theme.css",
      'primeicons/primeicons.css'
    ],
    build: {
      // transpile: ["primevue"]
    },
    modules: [
      '@sidebase/nuxt-auth',
      '@nuxt/devtools'
    ],    
    auth: {
      provider: {
        type: 'authjs',
        addDefaultCallbackUrl: '/'
      },
      // The module is enabled. Change this to disable the module
      isEnabled: true,
      // TODO: set baseURL before production
      
    },
    devtools: {
      enabled: true
    },
    vite: {
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: '@import "@/assets/styles/_vars.scss";'
          }
        }
      }
    }
})
