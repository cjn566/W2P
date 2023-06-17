
<!-- 
:filter="filter" 
:filter-function="filterGames" 
@filtered="onFilter"  
empty-filtered-text="There are no games to show."
-->

<template>
    <b-table 
        id="gamestable" 
        title="Available Games" 
        sticky-header="100%" 
        striped
        show-empty 
        :busy="loadingCollection"
        :fields="displayFields" 
        :items="displayGames">

        <template #cell(thumbnail)="data">
            <b-img-lazy :src="data.value" height="80px" />
        </template>

        <template #cell(name)="data">
            <div v-b-popover.hover.v-info.topright="data.item.description" :title="data.value">
                <a target="_blank" :href="getGameURL(data.item.id)">{{ data.value }}</a>
            </div>
        </template>

        <template #cell(rating)="data">
            {{ data.value > 0 ? `${data.value}${settings.showNumVotes.rating ? ` (${data.item.ratingVotes})` : ''}` : '-' }}
        </template>

        <template #cell(complexity)="data">
            {{ data.value > 0 ? `${data.value}${settings.showNumVotes.complexity ? ` (${data.item.complexityVotes})` : ''}` :
                '-' }}
        </template>

        <template #cell(players)="data">
            {{ data.item.minplayers == data.item.maxplayers ? data.item.minplayers : data.item.minplayers + " - " +
                data.item.maxplayers }}
        </template>

        <template #cell(playtime)="data">
            {{ formatPlaytime(data.item) }}
        </template>

        <template #cell(minage)="data">
            {{ data.value > 0 ? data.value + 'y' : '-' }}
        </template>

        <template #cell(publishyear)="data">
            {{ data.value > 0 ? data.value : '-' }}
        </template>

        <template #cell(tags)="data">
            <b-form-tags class="tags-table" disabled>
                <b-form-tag v-for="tag, index in data.value" :key="index" no-remove :style="tagStyle(tag.match)">
                    <div @click="addFilterTag(tag)">{{ tag.name }}</div>
                </b-form-tag>
            </b-form-tags>
        </template>

        <template #cell(description)="row">
            <b-button size="sm" @click="row.toggleDetails" variant="primary">
                {{ row.detailsShowing ? 'Hide' : 'Show' }}
            </b-button>
        </template>

        <template #row-details="row">
            <div style="max-width: 80%">
                {{ row.item.description }}
            </div>
        </template>

        <template #table-busy>
            <div class="text-center text-danger my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong>Loading...</strong>
            </div>
        </template>
    </b-table>

    <pre>{{ games }}</pre>
</template>

<script setup>
const games = useState('games')

const fields = {
    thumbnail: {
        label: '',
        sortable: false,
    },
    name: {
        label: 'Game',
    },
    rank: {},
    rating: {},
    complexity: {
        label: 'Complexity (out of 5)',
    },
    players: {
        sortable: false,
    },
    playtime: {
        label: 'Play Time',
        sortable: false,
    },
    minage: {
        label: 'Min Age',
    },
    publishyear: {
        label: 'Year Published',
    },
    tags: {},
    description: {}
}

const settings = {
    showColumns: {
        rank: true,
        rating: true,
        complexity: true,
        players: true,
        playtime: true,
        minage: true,
        publishyear: true,
        tags: true,
        description: true,
    },
    showNumVotes: {
        rating: true,
        complexity: true
    }
}

const displayGames = computed(() => {
    return games.value
    // let allGames = this.collectionGames.concat(this.extraGames)
    //   return games.value.map((game) => {
    //     game.matchesSome = false
    //     game.matchesAll = true
    //     game.tags = game.tags.map((tag) => {
    //       tag.match = null
    //       return tag
    //     })
    //     for(let i = 0; i < this.filter.tags.length; i++) {
    //       let matchIdx = game.tags.findIndex((tag) => { return tag.id == this.filter.tags[i].id })
    //       if (matchIdx >= 0) {
    //         game.matchesSome = true
    //         game.tags[matchIdx].match = this.tagColors[i]
    //       } else {
    //         game.matchesAll = false
    //       }
    //     }
    //     return game
    //   })
})

const displayFields = computed(() => {
    const result = []
    for (const [key, values] of Object.entries(fields)) {
        if (settings.showColumns[key] ?? true) {
            result.push({
                key,
                sortable: values.sortable ?? true,
                ...values
            })
        }
    }
    return result
})


</script>

<style scoped></style>