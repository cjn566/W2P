import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
    faUserSecret,
    faBars,
    faHouseUser,
    faScrewdriverWrench,
    faFire,
    faInfo,
    faRightFromBracket

} from '@fortawesome/free-solid-svg-icons';

/* add icons to the library */
library.add(faUserSecret, faBars, faHouseUser, faScrewdriverWrench, faFire, faInfo, faRightFromBracket)

config.autoAddCss = false

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
  })
