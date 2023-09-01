import ToastPlugin from 'vue-toast-notification'

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.use(ToastPlugin)
})