<template>
    <a href="#" @click.prevent="props.item.onClick" >
        <div class="item">
            <client-only>
                <div class="item__icon">
                    <font-awesome-icon :icon="['fas', props.item.icon]" size="2x" />
                </div>
            </client-only>
            <!-- solo mostrar que no collapsed -->
            <div class="item__title" v-if="!collapsed">
                {{ props.item.title }}
            </div>
        </div>
    </a>
</template>

<script setup>
    const props = defineProps(['item', 'collapsed'])
</script>

<style scoped>

a {
    text-decoration: none;
    display: block;
    margin: var(--separacion) 0;
}

.item:hover .item__title{
    color: var(--colorNegroRelax);
    background-color: var(--colorBlancoRelax);
}



.item {
    display: flex;
    align-items: center;
    padding: var(--separacion);
    gap: var(--separacion);
}

.item__icon {
    width: 4.4rem;
    display: flex;
    justify-content: center;
    align-items: center;
}

.item__title {
    padding: .5rem;
    border-radius: var(--redondeo);
}


</style>