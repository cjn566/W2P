<template>
    <div class="card">
        <span id="image-container">
            <img :src="game.thumbnail" alt="Game Thumbnail" class="card-image" />
        </span>
        <span id="details">

            <span id="header">
                <span id="hex">
                    <span id="hex-icon">&#x2B22;</span>
                    <span id="rating" :class="sort == 'rating' ? 'active' : ''">{{ game.display.rating }}</span>
                </span>

                <a :href="getGameURL(game.bgg_game_id)" target="_blank" rel="noopener noreferrer" id="bgg-link">
                    <span id="name" :class="sort == 'name' ? 'active' : ''">{{ game.name }}</span>
                    <span id="year" :class="sort == 'year' ? 'active' : ''"> ({{ game.display.year }})</span>
                </a>
            </span>


            <div id="both-panes">
                <div class="side-pane border-right">
                    <div class="panel border-bottom" :class="sort == 'complexity' ? 'active' : ''">
                            {{ game.display.complexity }} / 5
                    </div>
                    <div class="panel" :class="sort == 'players' ? 'active' : ''">
                            {{ game.display.players }}{{ isMobile ? 'p' : ' Players' }}
                    </div>
                </div>
                <div class="side-pane">
                    <div class="panel border-bottom" :class="sort == 'playtime' ? 'active' : ''">
                            {{ game.display.playtime }}{{ isMobile ? 'm' : ' Minutes' }}
                    </div>
                    <div class="panel" :class="sort == 'age' ? 'active' : ''">
                        {{ isMobile ? `${game.display.age}y+` : `Age ${game.display.age} and up` }}
                    </div>
                </div>
            </div>
        </span>
    </div>
</template>

<script setup>
import { isMobile } from '~/composables/useMedia'
const props = defineProps(['game', 'sort'])


</script>

<style lang="scss" scoped>

.card {
    display: flex;
    font-size: large;
    flex-direction: row;
    padding: 0.6rem;
    border-radius: 0.4rem;
    margin-top: 1rem;
    height: 10rem;
    background-color: $w2p-pallette-5;
}

#details {
    display: flex;
    flex-direction: column;
    margin-left: 1rem;
    width: 100%;
}

.border-right {
    border-right: 1px solid $w2p-pallette-3;
}

.border-bottom {
    border-bottom: 1px solid $w2p-pallette-3;
}

#both-panes {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
}

.side-pane {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

.panel {
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
}

#image-container {
    width: 230px;
}

.card-image {
    height: 100%;
    width: 100%;
    flex-basis: 20%;
    object-fit: contain;
    object-position: 50% 50%;
}


#header {
    display: flex;
    margin: 1rem;
}

#hex {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
}

#hex-icon {
    font-size: 3.5rem;
    position: absolute;
    color: #1978B3;
}

#rating {
    font-size: 1.1rem;
    font-weight: bold;
    text-shadow: 0 0 5px black;
    z-index: 5;
}

#bgg-link {
    color: white;
    display: inline;
    width: fit-content;
    margin-left: 1rem;
}

#name {
    font-size: 1.3rem;
    text-shadow: 0 0 5px black;

}

#year {
    font-size: 1rem;
    text-shadow: 0 0 5px black;
}

.active {
    color: #d4ff00;
}
</style>