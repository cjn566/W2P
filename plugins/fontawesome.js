import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
    faBars,
    faRightFromBracket,
    faDice,
    faUsers,
    faCalendarDays,
    faCircleQuestion,
    faGear,
    faPen,
    faChessBoard,
    faStar,
    faBrain,
    faPeopleGroup,
    faClock,
    faPersonCane,
    faCalendar,
    faFilter,
    faFilterCircleXmark
} from '@fortawesome/free-solid-svg-icons';

/* add icons to the library */

library.add( faGear, faCircleQuestion, faCalendarDays, 
    faUsers, faDice, faBars, faRightFromBracket, 
    faPen, faChessBoard, faStar, faBrain, faPeopleGroup,
    faClock, faPersonCane, faCalendar, faFilter, faFilterCircleXmark)

config.autoAddCss = false

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
  })
