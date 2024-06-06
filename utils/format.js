export function formatGame(game) {
    game.display = {
        rating: game.rating > 0.1 ? ''+game.rating : '-',
        complexity: game.complexity > 0.1 ? ''+game.complexity : '-',
        players: game.playersMin == game.playersMax ? game.playersMin : `${game.playersMin} - ${game.playersMax}`,
        playtime: game.playtimeMin? (game.playtimeMin == game.playtimeMax ? game.playtimeMin + 'm' : `${game.playtimeMin} - ${game.playtimeMax}m`) : '-',
        age: game.age ? game.age + 'y' : '-',
        year: game.year ? ''+game.year : '-'
    }
}