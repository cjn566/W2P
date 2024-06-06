<template>
    <div class="card">
        <img :src="game.thumbnail" alt="Game Thumbnail" class="card-image" />
        <span id="details">
            <a :href="getGameURL(game.bgg_game_id)" target="_blank" rel="noopener noreferrer" id="bgg-link">{{
            game.name }}</a>
            <div id="both-panes">
                <div class="pane">
                    <span :class="sort=='rating'? 'active' : ''">{{ game.display.rating }}</span>
                    <span :class="sort=='complexity'? 'active' : ''">{{ game.display.complexity }}</span>
                    <span :class="sort=='players'? 'active' : ''">{{ game.display.players }}</span>
                </div>
                <div class="pane">
                    <span :class="sort=='playtime'? 'active' : ''">{{ game.display.playtime }}</span>
                    <span :class="sort=='age'? 'active' : ''">{{ game.display.age }}</span>
                    <span :class="sort=='year'? 'active' : ''">{{ game.display.year }}</span>
                </div>
            </div>
        </span>
    </div>
</template>

<script setup>
const props = defineProps(['game', 'sort'])

</script>

<style lang="scss" scoped>
.card {
    display: flex;
    flex-direction: row;
    padding: 0.6rem;
    border-radius: 0.4rem;
    margin-top: 1rem;
    height: 10rem;
    background-color: $w2p-pallette-4;
}

#details {
    display: flex;
    flex-direction: column;
    flex-basis: 80%;
    justify-content: center;
    margin-left: 1rem;
    width: 100%;
}

#both-panes {
    display: flex;
    flex-direction: row;
    align-items: stretch;
}

.pane {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: space-evenly;
}

.active {
    color: #d4ff00;
}

.card-image {
    height: 100%;
    flex-basis: 20%;
    object-fit: contain;
    object-position: 50% 50%;
}

#bgg-link {
    color: white;
    font-size: large;

}
</style>