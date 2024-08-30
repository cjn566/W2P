import ripple from "./assets/styles/tailwind-presets/aura/ripple";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    css: [
      '@/assets/styles/main.scss',      
      '@fortawesome/fontawesome-svg-core/styles.css',      
      //'primevue/resources/themes/lara-dark-blue/theme.css',
      'primeicons/primeicons.css'
    ],
    build: {
      // transpile: ["primevue"]
    },
    app: {
      head: {
        viewport: 'width=device-width, initial-scale=1',
      }
    },
    modules: [
      '@sidebase/nuxt-auth',
      '@nuxt/devtools',
      '@primevue/nuxt-module',
      '@nuxtjs/tailwindcss'
    ],
    primevue: {
      options: {
        // theme: {
        //   preset: 'Aura',
        // },
        // ripple: true,
        unstyled: true
      },
      // autoImport: true
      importPT: {
        as: 'Aura',
        from: '@/assets/styles/tailwind-presets/aura'
      }
    },
    auth: {
      provider: {
        type: 'authjs',
        addDefaultCallbackUrl: '/about'
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
