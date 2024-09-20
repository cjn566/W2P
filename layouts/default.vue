<template>
    <div>
        <!-- <Header /> -->
        <div class="px-1 h-[150%]">
            <slot />
        </div>
        <div class="flex justify-center py-12">
            <a href="https://boardgamegeek.com" target="_blank" rel="noopener noreferrer">
                <img src="~/assets/icons/poweredByBgg.webp" alt="hero" class="w-60 h-auto" />
            </a>
        </div>
    </div>
</template>