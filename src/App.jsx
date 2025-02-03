import { useEffect, useRef, useState } from "react";
import "./App.css";
import "./styles/main.css";

// const expected = [
//   {
//     displayChar: "a",
//     inputChar: "",
//     style: "unvisited",
//     cursor: true,
//   },
// ];

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
  while (sentence.split(" ").length < 50) {
    sentence +=
      `${subjects[Math.floor(Math.random() * subjects.length)]} ` +
      `${verbs[Math.floor(Math.random() * verbs.length)]} ` +
      `${objects[Math.floor(Math.random() * objects.length)]} ` +
      `${adverbs[Math.floor(Math.random() * adverbs.length)]} ` +
      `${extraPhrases[Math.floor(Math.random() * extraPhrases.length)]}. `;
  }

  return sentence.trim();
}

function App() {
  const [expected, setExpected] = useState([]); // this is answer
  const [userInputStr, setUserInputStr] = useState(""); // to take user input in string
  const [userInput, setUserInput] = useState([]); // to convert user input to array
  const [display, setDisplay] = useState(expected); // this would be directly displayed
  const [stats, setStats] = useState({
    wordspMin: 0,
    charspMin: 0,
    accuracy: 0,
  });

  const inputRef = useRef();

  // to initially load expected array
  useEffect(() => {
    const temp = generateRandomSentence()
      .split("")
      .map((char, i) => {
        const cursorVal = i === 0 ? true : false;
        return {
          displayChar: char,
          inputChar: "",
          style: "unvisited",
          cursor: cursorVal,
        };
      });
    setExpected(temp);
    setDisplay(temp);
    inputRef.current?.focus();
  }, []);

  // to compare userInput with expected array
  useEffect(() => {
    if (expected[0] !== undefined) {
      setDisplay((cur) => {
        return cur.map((val, i) => {
          if (i < userInput.length) {
            return {
              ...val,
              inputChar: userInput[i],
              cursor: false,
              style: val.displayChar === userInput[i] ? "green" : "red",
            };
          }
          if (i === userInput.length) {
            return { ...expected[i], cursor: true };
          }
          return expected[i];
        });
      });
    }
  }, [userInput, expected]);

  // to calculate stats according to display  (words/min, char/min, accuracy)
  useEffect(() => {
    let totalWord = 0;
    // let correctWord = 0;
    let totalChar = 0;
    let correctChar = 0;
    for (let i = 0; i < display.length; i++) {
      const charDetails = display[i];
      console.log(i);
      if (display[i].inputChar === "") {
        console.log("stat for loop breaked");
        break;
      } // break if input char doesnt exist
      totalChar++;
      if (charDetails.displayChar === charDetails.inputChar) correctChar++;

      if (charDetails.inputChar === " ") totalWord++;
    }
    setStats({
      wordspMin: totalWord,
      charspMin: totalChar,
      accuracy: (correctChar / totalChar) * 100, // calculating accuracy on the basis of correct characters
    });
  }, [display]);

  function handleTextInput(e) {
    const inputValue = e.target.value;
    setUserInputStr(inputValue);
    setUserInput(inputValue.split(""));
  }

  return (
    <>
      <div className="mb-5 self-start">Start Typing</div>
      <div className="relative">
        <input
          type="text"
          value={userInputStr}
          onChange={handleTextInput}
          className="relative border-2 border-amber-200 z-20 w-full"
          style={{ opacity: "0" }}
          ref={inputRef}
        />
        <div className="absolute top-0 left-1 z-10 flex">
          {/* {console.log(display)} */}
          <div className="flex flex-wrap">
            {display.map((charDetails, i) => (
              <div className="flex relative" key={i}>
                {charDetails?.cursor ? (
                  <div className="h-auto w-0.25 bg-white animate-blink opacity-0"></div>
                ) : (
                  <div className="h-auto w-0.25"></div>
                )}
                <span className={`${charDetails?.style}`}>
                  {charDetails?.inputChar != ""
                    ? charDetails?.inputChar === " "
                      ? "\u00A0"
                      : charDetails?.inputChar
                    : charDetails?.displayChar === " "
                    ? "\u00A0"
                    : charDetails?.displayChar}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="stats mt-40 flex gap-20 justify-center">
        <div className="flex">
          <div className="text-amber-200">Words/Min :</div>
          <div className="ml-1">{stats.wordspMin}</div>
        </div>
        <div className="flex">
          <div className="text-amber-200">Chars/Min :</div>
          <div className="ml-1">{stats.charspMin}</div>
        </div>
        <div className="flex">
          <div className="text-amber-200">Accuracy :</div>
          <div className="ml-1">
            {stats.accuracy ? Math.round(stats.accuracy) : 0}%
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
