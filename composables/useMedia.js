// useMedia.js
import { ref, watchEffect } from "vue";

export const useMedia = (query) => {
   const matches = ref(true);

   watchEffect((onInvalidate) => {
      const media = window.matchMedia(query);

      if(media.matches !== matches.value) {
         matches.value = media.matches;
      }

      const onChange = () => {
         matches.value = media.matches;
      }

      media.addEventListener("change", onChange);

      onInvalidate(() => {
         media.removeEventListener("change", onChange);
      });
   });

   return matches
}


export const isMobile = useMedia("(max-width: 640px)")
export const isDesktop = useMedia("(max-width: 768px)")


/*
if ('ontouchstart' in window || navigator.maxTouchPoints) {
  // Touch is supported, indicating a touch-enabled device
  // Place your mobile-specific code here
} else {
  // No touch support, indicating a non-touch device
  // Place your non-mobile-specific code here
}
*/