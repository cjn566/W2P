export default function blankFilters() {
    return {
        areSet: false,
        search: '',
        rating: 0,
        complexity: [0,5],
        players: 0,
        time: [0, null],
        age: [0, null],
        year: [0, null],
    }
}