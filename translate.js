/* eslint-disable no-console */
const sanakirja = require('./index');
const words = require('./words');
var fs = require('fs');


async function get_translations(word) {
    result = await sanakirja(word).catch(err => console.error(err));
    translations = result['translations'].map(translation => translation['meaning'])
    return Array.from(new Set(translations)).sort()
}

(async () => {
    words_and_translations = []
    for (index in words) {
        word = words[index]
        translations = await get_translations(word)
        string_format = [word, ''] + translations
        words_and_translations.push(string_format.toLowerCase())
    }
    string_format = words_and_translations.join('\n')
    fs.writeFile('translations.csv', string_format, 'utf8', (err) => err);
    console.log('Translations were saved in "./translations.csv"')
})();

