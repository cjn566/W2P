export default function blankFilters() {
    return {
        areSet: false,
        search: '',
        tags: [],
        rating: [0, 10],
        complexity: [0,5],
        players: [0, null],
        time: [0, null],
        age: [0, null],
        year: [0, null],
    }
}