import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import "./styles/main.css";

// const original = [
//   {
//     displayChar: "a",
//     inputChar: "",
//     className2: "unvisited",
//     cursor: true,
//   },
//   {
//     displayChar: "b",
//     inputChar: "",
//     className2: "unvisited",
//     cursor: false,
//   },
//   {
//     displayChar: "c",
//     inputChar: "",
//     className2: "unvisited",
//     cursor: false,
//   },
//   {
//     displayChar: " ",
//     inputChar: "",
//     className2: "unvisited",
//     cursor: false,
//   },
//   {
//     displayChar: "a",
//     inputChar: "",
//     className2: "unvisited",
//     cursor: false,
//   },
//   {
//     displayChar: "k",
//     inputChar: "",
//     className2: "unvisited",
//     cursor: false,
//   },
//   {
//     displayChar: " ",
//     inputChar: "",
//     className2: "unvisited",
//     cursor: false,
//   },
//   {
//     displayChar: "c",
//     inputChar: "",
//     className2: "unvisited",
//     cursor: false,
//   },
//   {
//     displayChar: "a",
//     inputChar: "",
//     className2: "unvisited",
//     cursor: false,
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

// console.log(generateRandomSentence());

// const temp = generateRandomSentence().split("");
// const original = temp.map((char, i) => {
//   const cursor = i === 0 ? true : false;
//   return { displayChar: char, inputChar: "", className2: "unvisited", cursor };
// });

function App() {
  const [original, setOriginal] = useState([]);
  const [userInputText, setUserInputText] = useState("");
  const [input, setInput] = useState([]);
  const [display, setDisplay] = useState(original);

  const inputRef = useRef();

  useEffect(() => {
    const temp = generateRandomSentence().split("");
    const og = temp.map((char, i) => {
      const cursor = i === 0 ? true : false;
      return {
        displayChar: char,
        inputChar: "",
        className2: "unvisited",
        cursor,
      };
    });
    setOriginal(og);
    setDisplay(og);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    display.forEach((val, i) => {
      if (i < input.length) {
        setDisplay((cur) => {
          const temp = [...cur];
          const classN = temp[i].displayChar === input[i] ? "green" : "red";
          // const cursorValue = i + 1 === input.length ? true : false;
          temp[i] = {
            ...temp[i],
            inputChar: input[i],
            className2: classN,
            cursor: false,
          };
          return temp;
        });
      } else {
        if (i === input.length) {
          setDisplay((cur) => {
            const temp = [...cur];
            temp[i] = { ...original[i], cursor: true };
            return temp;
          });
        } else {
          setDisplay((cur) => {
            const temp = [...cur];
            temp[i] = original[i];
            return temp;
          });
        }
      }
    });
  }, [input]);

  function handleTextInput(e) {
    setUserInputText(e.target.value);
    setInput(e.target.value.split(""));
  }

  return (
    <>
      <div className="mb-5 self-start">Start Typing</div>
      <div className="relative">
        <input
          type="text"
          value={userInputText}
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
                {charDetails.cursor ? (
                  <div className="h-auto w-0.25 bg-white animate-blink"></div>
                ) : (
                  <div className="h-auto w-0.25"></div>
                )}
                <span className={`${charDetails.className2}`}>
                  {charDetails.inputChar != ""
                    ? charDetails.inputChar === " "
                      ? "\u00A0"
                      : charDetails.displayChar
                    : charDetails.displayChar === " "
                    ? "\u00A0"
                    : charDetails.displayChar}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
