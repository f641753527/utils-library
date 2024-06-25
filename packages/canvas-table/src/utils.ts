export function generateRandomChineseChar(length = 2) {
    const start = 0x4e00;
    const end = 0x9fa5;
    let result = '';
    for (let i = 0; i < length; i++) {
        var randomCode = Math.floor(Math.random() * (end - start + 1)) + start;
        result += String.fromCharCode(randomCode);
    }
    return result;
}
