import PrimeVue from "primevue/config"
import Button from "primevue/button"
import InputText from 'primevue/inputtext'
import MultiSelect from 'primevue/multiselect';
import Slider from 'primevue/slider';
import ProgressBar from 'primevue/progressbar';
import Dropdown from 'primevue/dropdown';
import Tag from 'primevue/tag';
import InputNumber from 'primevue/inputnumber';
import Calendar from 'primevue/calendar';


export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(PrimeVue, { ripple: true });
    nuxtApp.vueApp.component("Button", Button);
    nuxtApp.vueApp.component("InputText", InputText);
    nuxtApp.vueApp.component("MultiSelect", MultiSelect);
    nuxtApp.vueApp.component("Slider", Slider);
    nuxtApp.vueApp.component("ProgressBar", ProgressBar);
    nuxtApp.vueApp.component("Dropdown", Dropdown);
    nuxtApp.vueApp.component("Tag", Tag);
    nuxtApp.vueApp.component("InputNumber", InputNumber);
    nuxtApp.vueApp.component("Calendar", Calendar);
    //other components that you need
});