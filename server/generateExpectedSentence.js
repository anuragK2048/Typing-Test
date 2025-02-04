function generateRandomSentence() {
  const subjects = [
    "The curious cat",
    "The energetic dog",
    "The colorful bird",
    "The wise old man",
    "The adventurous woman",
    "A determined scientist",
    "A young explorer",
    "The brave firefighter",
    "An intelligent student",
    "A creative artist",
  ];
  const verbs = [
    "ran swiftly",
    "jumped excitedly",
    "sang beautifully",
    "swam gracefully",
    "flew majestically",
    "danced joyfully",
    "laughed heartily",
    "whispered softly",
    "shouted loudly",
    "crawled carefully",
  ];
  const objects = [
    "over the wooden fence",
    "into the deep blue water",
    "through the cloudy sky",
    "on the freshly cut grass",
    "inside the ancient cave",
    "behind the massive oak tree",
    "next to the flowing river",
    "under the brightly lit street lamp",
    "across the long bridge",
    "between the towering buildings",
  ];
  const adverbs = [
    "quickly and effortlessly",
    "slowly but steadily",
    "gracefully and elegantly",
    "silently yet mysteriously",
    "happily and without hesitation",
    "sadly but with purpose",
    "unexpectedly and dramatically",
    "mysteriously and cautiously",
    "angrily yet controlled",
    "cheerfully as if nothing was wrong",
  ];
  const extraPhrases = [
    "before the sun dipped below the horizon",
    "while a gentle breeze rustled the trees",
    "as birds chirped melodiously in the background",
    "under the warm glow of the streetlights",
    "while the distant thunder echoed in the sky",
    "with determination in their eyes",
    "as the crowd watched in awe",
    "without a single moment of doubt",
    "in a way that left everyone speechless",
    "before vanishing into the night",
  ];

  let sentence = "";
  while (sentence.split(" ").length < 40) {
    sentence +=
      `${subjects[Math.floor(Math.random() * subjects.length)]} ` +
      `${verbs[Math.floor(Math.random() * verbs.length)]} ` +
      `${objects[Math.floor(Math.random() * objects.length)]} ` +
      `${adverbs[Math.floor(Math.random() * adverbs.length)]} ` +
      `${extraPhrases[Math.floor(Math.random() * extraPhrases.length)]}. `;
  }

  return sentence.trim();
}

module.exports = generateRandomSentence;
