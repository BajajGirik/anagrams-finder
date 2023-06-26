## How to run the program?

Use the command below to easily run the project

```bash
node src/index.js ${wordToSearchAnagramsInFile}
```

> To keep things fast I do not compute the "anagrams-meta.json" in the first go if the file already exists. The next time you run the program, it should have the latest data.

## Basic Walkthrough:
 - Search for "anagrams-meta.json" file.
 - If found
   - Retrieve the anagrams array and print it out along with recomputation of the "anagrams-meta.json" file for next time usage (Recomputation is a non-blocking action and should not slower the output).
 - If not found
   - Create and store the "anagrams-meta.json" for easy retrievals in future

## How is data stored in anagrams-meta.json?
Data is stored as json in the file which is of type:
```json
[
    {
        "sortedString": ["...All anagrams with the same set of characters as that in `sortedString`"]
    }
]
```

```js
array[lengthOfAnagram][sortedString] => All the anagrams present in "words.txt" file.
```

There would be different buckets (array) that would be divided by the number of
characters (this acts as the index of the array) in the word. Each individual bucket will consist of the sorted
string of the anagramWord which points down to all the valid anagrams (stored as another array).
