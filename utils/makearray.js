export default function makeArray(x) {
if (!Array.isArray(x)) {
        x = [x]
    }
    return x
}