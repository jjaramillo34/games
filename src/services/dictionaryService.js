const ENGLISH_API_BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en";
const SPANISH_API_BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/es";

// Cache for words to avoid repeated API calls
const wordCache = {
  en: new Set(),
  es: new Set(),
};

// Difficulty levels with word length ranges
const DIFFICULTY_RANGES = {
  easy: { min: 4, max: 6 },
  medium: { min: 7, max: 9 },
  hard: { min: 10, max: 14 },
};

export const fetchRandomWord = async (
  language = "en",
  difficulty = "medium"
) => {
  try {
    const baseUrl =
      language === "en" ? ENGLISH_API_BASE_URL : SPANISH_API_BASE_URL;
    const range = DIFFICULTY_RANGES[difficulty];

    // If we have cached words for this language, try to use one
    if (wordCache[language].size > 0) {
      const words = Array.from(wordCache[language]);
      const validWords = words.filter(
        (word) => word.length >= range.min && word.length <= range.max
      );
      if (validWords.length > 0) {
        return validWords[Math.floor(Math.random() * validWords.length)];
      }
    }

    // Fetch a batch of words
    const letters = "abcdefghijklmnopqrstuvwxyz";
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    const response = await fetch(`${baseUrl}/${randomLetter}`);

    if (!response.ok) {
      throw new Error("Failed to fetch words");
    }

    const data = await response.json();
    const words = data.flatMap((entry) => {
      // Get the main word and its variations
      const mainWord = entry.word;
      const variations =
        entry.meanings
          ?.flatMap(
            (meaning) =>
              meaning.definitions?.map((def) => def.example)?.filter(Boolean) ||
              []
          )
          ?.filter(
            (word) =>
              word &&
              word.length >= range.min &&
              word.length <= range.max &&
              !word.includes(" ")
          ) || [];

      return [mainWord, ...variations];
    });

    // Cache the words for future use
    words.forEach((word) => wordCache[language].add(word.toLowerCase()));

    // Filter words by length according to difficulty
    const validWords = words.filter(
      (word) =>
        word &&
        word.length >= range.min &&
        word.length <= range.max &&
        !word.includes(" ")
    );

    if (validWords.length === 0) {
      // If no words match our criteria, try again with a different letter
      return await fetchRandomWord(language, difficulty);
    }

    return validWords[
      Math.floor(Math.random() * validWords.length)
    ].toLowerCase();
  } catch (error) {
    console.error("Error fetching word:", error);
    // Fallback words in case the API fails
    const fallbackWords = {
      en: {
        easy: ["cat", "dog", "bird", "fish"],
        medium: ["elephant", "giraffe", "penguin"],
        hard: ["hippopotamus", "rhinoceros", "crocodile"],
      },
      es: {
        easy: ["gato", "perro", "pez", "sol"],
        medium: ["elefante", "jirafa", "pingüino"],
        hard: ["hipopótamo", "cocodrilo", "mariposa"],
      },
    };

    return fallbackWords[language][difficulty][
      Math.floor(Math.random() * fallbackWords[language][difficulty].length)
    ];
  }
};

export const getWordDefinition = async (word, language = "en") => {
  try {
    const baseUrl =
      language === "en" ? ENGLISH_API_BASE_URL : SPANISH_API_BASE_URL;
    const response = await fetch(`${baseUrl}/${word}`);

    if (!response.ok) {
      throw new Error("Failed to fetch word definition");
    }

    const data = await response.json();
    const definitions =
      data[0]?.meanings?.flatMap((meaning) =>
        meaning.definitions.map((def) => ({
          definition: def.definition,
          example: def.example,
          partOfSpeech: meaning.partOfSpeech,
        }))
      ) || [];

    return {
      word: data[0].word,
      phonetic: data[0].phonetic,
      definitions,
    };
  } catch (error) {
    console.error("Error fetching word definition:", error);
    return null;
  }
};

// Helper function to preload some words for better user experience
export const preloadWords = async (language = "en") => {
  const letters = "aeiou"; // Start with vowels for better word variety
  const promises = letters.split("").map((letter) =>
    fetch(
      `${
        language === "en" ? ENGLISH_API_BASE_URL : SPANISH_API_BASE_URL
      }/${letter}`
    )
      .then((res) => res.json())
      .then((data) => {
        data.forEach((entry) => {
          if (entry.word && !entry.word.includes(" ")) {
            wordCache[language].add(entry.word.toLowerCase());
          }
        });
      })
      .catch(() => {})
  );

  await Promise.allSettled(promises);
};
