<template>
    <div>
        <Header />
        <div class="px-1 h-[150%]">
            <slot />
        </div>
    </div>
</template>

<script setup>

import { useMedia } from '~/composables/useMedia'

    
</script>

<style lang="scss" scoped>

$breakpoints: (
  phone-sm: 420px,
  phone: 767px,
  tablet: 768px,
  tablet-lg: 1024px,
  desktop: 1025px,
  desktop-lg: 1600px
  );


@mixin for-size($breakpoint) {

    // If the breakpoint exists in the map.
    @if map-has-key($breakpoints, $breakpoint) {

        // Get the breakpoint value.
        $breakpoint-value: map-get($breakpoints, $breakpoint);

        //Build the media query
        @media (max-width: $breakpoint-value) {
            @content;
        }
    } 
}

.content {
    margin: 0 auto;
    height: 100%;
}
</style>
