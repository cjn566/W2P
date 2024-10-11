<template>

    <div class="flex h-fit ml-2">
        <span class="flex items-center justify-center w-10 relative">
            <span class="absolute text-6xl hex" :class="ratingColor">&#x2B22;</span>
            <span class="text-lg font-bold z-10" :class="{ 'active-sort': sorting.active == 'rating' }">
                {{ game.display.rating }}
            </span>
        </span>
        <div class="ml-2">
            <div class="line-clamp-1" :class="{ 'active-sort': sorting.active == 'name' }">{{ game.name }}</div>
            <div class="text-sm" :class="{ 'active-sort': sorting.active == 'year' }"> {{ game.display.year }}</div>
        </div>
    </div>

</template>

<script setup>
import { sorting } from '~/composables/useGames'
const props = defineProps(['game'])


const ratingColor = computed(() => {
    if (props.game.rating == 0) return 'bgg-rating-none'
    if (props.game.rating >= 8) return 'bgg-rating-8-up'
    if (props.game.rating >= 7) return 'bgg-rating-7-up'
    if (props.game.rating >= 5) return 'bgg-rating-5-up'
    return 'bgg-rating-below-5'
})

</script>

<style lang="scss" scoped>
$bgg-rating-8-up: #1d8049;
$bgg-rating-7-up: #1c77ae;
$bgg-rating-5-up: #5469a0;
$bgg-rating-below-5: #d5182a;

.bgg-rating-8-up {
    color: $bgg-rating-8-up;
}

.bgg-rating-7-up {
    color: $bgg-rating-7-up;
}

.bgg-rating-5-up {
    color: $bgg-rating-5-up;
}

.bgg-rating-below-5 {
    color: $bgg-rating-below-5;
}

.bgg-rating-none {
    color: #313131;
}
</style>