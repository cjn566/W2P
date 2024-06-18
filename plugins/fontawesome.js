import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
    fas,
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
    faHourglassHalf,
    faPersonCane,
    faCalendar,
    faFilter,
    faFilterCircleXmark,
    faMagnifyingGlass,
    faMicroscope
} from '@fortawesome/free-solid-svg-icons';

/* add icons to the library */

library.add( fas, faGear, faCircleQuestion, faCalendarDays, 
    faUsers, faDice, faBars, faRightFromBracket, 
    faPen, faChessBoard, faStar, faBrain, faPeopleGroup,
    faHourglassHalf, faPersonCane, faCalendar, faFilter, faFilterCircleXmark, faMagnifyingGlass, faMicroscope)

config.autoAddCss = false

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
  })
