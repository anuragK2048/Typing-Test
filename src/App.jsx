import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import "./styles/main.css";

const original = [
  {
    displayChar: "a",
    inputChar: "",
    className2: "unvisited",
    cursor: true,
  },
  {
    displayChar: "b",
    inputChar: "",
    className2: "unvisited",
    cursor: false,
  },
  {
    displayChar: "c",
    inputChar: "",
    className2: "unvisited",
    cursor: false,
  },
  {
    displayChar: " ",
    inputChar: "",
    className2: "unvisited",
    cursor: false,
  },
  {
    displayChar: "a",
    inputChar: "",
    className2: "unvisited",
    cursor: false,
  },
  {
    displayChar: "k",
    inputChar: "",
    className2: "unvisited",
    cursor: false,
  },
  {
    displayChar: " ",
    inputChar: "",
    className2: "unvisited",
    cursor: false,
  },
  {
    displayChar: "c",
    inputChar: "",
    className2: "unvisited",
    cursor: false,
  },
  {
    displayChar: "a",
    inputChar: "",
    className2: "unvisited",
    cursor: false,
  },
];

function generateRandomSentence() {
  const subjects = ["The cat", "The dog", "The bird", "The man", "The woman"];
  const verbs = ["ran", "jumped", "sang", "swam", "flew"];
  const objects = [
    "over the fence",
    "into the water",
    "through the air",
    "on the ground",
    "in the tree",
  ];

  const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
  const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
  const randomObject = objects[Math.floor(Math.random() * objects.length)];

  return `${randomSubject} ${randomVerb} ${randomObject}`;
}

function App() {
  console.log(generateRandomSentence());
  const [userInputText, setUserInputText] = useState("");
  const [input, setInput] = useState([]);
  const [display, setDisplay] = useState(original);

  useEffect(() => {
    display.forEach((val, i) => {
      if (i < input.length) {
        setDisplay((cur) => {
          const temp = [...cur];
          const classN = temp[i].displayChar === input[i] ? "green" : "red";
          const cursorValue = i + 1 === input.length ? true : false;
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
      <div className="relative">
        <input
          type="text"
          value={userInputText}
          onChange={handleTextInput}
          className="relative border-2 border-amber-200 z-20"
          style={{ opacity: "0" }}
        />
        <div className="absolute top-0 left-1 z-10 flex">
          {console.log(display)}
          {display.map((charDetails, i) => (
            <div className="flex relative">
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
    </>
  );
}

export default App;
