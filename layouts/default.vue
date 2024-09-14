<template>
    <div>
        <Header />
        <div class="px-1 h-[150%]">
            <slot />
        </div>
        <a href="https://boardgamegeek.com" target="_blank" rel="noopener noreferrer">
            <img src="~/assets/icons/poweredByBgg.webp" alt="hero" class="w-60 h-auto mx-auto" />
        </a>
    </div>
</template>