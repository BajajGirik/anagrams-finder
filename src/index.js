import fs from "fs/promises";
import fsSync from "fs";

const anagramsDataFilePath = "./static/anagrams-meta.json";

let dictionary = new Set();

const sortString = (str) => {
  return [...str].sort((a, b) => a.localeCompare(b)).join("");
}

const getWordsFromFile = async (filePath, separator) => {
    const fileExists = fsSync.existsSync(filePath);

    if (!fileExists) {
        console.error(`File ${filePath} doesn't exist`);
        process.exit(1);
    }

    const data = await fs.readFile(filePath);
    const wordsArr = data.toString().split(separator);
    return wordsArr;
}

const createAndStoreAnagramsData = async () => {
    const words = await getWordsFromFile("./static/words.txt", "\n");
    // Final anagrams data would be stored as mentioned below:
    // There would be different buckets that would be divided by the number of
    // characters in the word. Each individual bucket will consist of the sorted
    // string of the anagramWord which points down to all the valid
    // anagrams (stored as an array)
    const anagramsData = [];

    words.forEach(w => {
        if (!w || !dictionary.has(w)) {
            // Not a valid word
            return;
        }

        const sortedWord = sortString(w);

        if (!anagramsData[w.length]) {
            anagramsData[w.length] = {};
        }

        if (!anagramsData[w.length][sortedWord]) {
            anagramsData[w.length][sortedWord] = [];
        }

        anagramsData[w.length][sortedWord].push(w);
    });

    // Non-blocking task, can happen later
    fs.writeFile(anagramsDataFilePath, JSON.stringify(anagramsData, null, 4)).catch(() => {});
    return anagramsData;
};

const getAnagramsData = async () => {
    try {
        const anagramsJsonData = await import(anagramsDataFilePath);
        // Recompute the latest data and store in file for the next time
        createAndStoreAnagramsData();
        return anagramsJsonData;
    } catch (err) {
        if (err.code !== "ERR_MODULE_NOT_FOUND") {
            // Some other error occured while loading the json file
            console.error("Something went wrong");
            process.exit(1);
        }

        const data = await createAndStoreAnagramsData();
        return data;
    }
};

const fillDictionary = async () => {
    const dictionaryWords = await getWordsFromFile("./static/dictionary.txt", "\n");
    dictionary = new Set(dictionaryWords);
};

const init = async () => {
    const givenWord = process.argv[2];

    if (givenWord == undefined) {
        console.error("No word provided");
        console.log(`You can run this script as "node src/index.js exampleWord" where "exampleWord" is the provided word`);
        process.exit(1);
    }

    await fillDictionary();

    const data = await getAnagramsData();
    const sortedWord = sortString(givenWord);
    const storedAnagramsForWord = data[sortedWord.length]?.[sortedWord];
    if (!storedAnagramsForWord || storedAnagramsForWord.length === 0) {
        return console.log("No anagrams found");
    }

    console.log(`Anagrams for word ${givenWord} are:`);
    console.log(storedAnagramsForWord.join(", "));
};

init();
