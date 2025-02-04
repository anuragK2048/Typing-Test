import { useEffect, useRef, useState } from "react";
import "./App.css";
import "./styles/main.css";
import StatsDisplay from "./components/StatsDisplay";
import Display from "./components/Display";
// import "./websocket/client";

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
  const [display, setDisplay] = useState([]); // this would be directly displayed
  const [stats, setStats] = useState({
    wordspMin: 0,
    charspMin: 0,
    accuracy: 0,
  });
  const [timer, setTimer] = useState(0);

  // web socket
  const [socket, setSocket] = useState(null);
  const [myPlayerId, setMyPlayerId] = useState(null);
  const [allPlayerInfo, setAllPlayerInfo] = useState([]);

  const inputRef = useRef();
  const timerRef = useRef();
  const displayWsRef = useRef();
  const displayRef = useRef();
  const playerIdRef = useRef();

  // establishing webSocket connection
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    // const ws = new WebSocket("ws://192.168.91.243:8080");
    ws.onopen = () => {
      console.log("connected to server");
    };
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data); // Convert JSON string to object
        // console.log(data);
        if (data.type === "init") {
          playerIdRef.current = data.payload;
          console.log("playerId set to", data.payload);
        } else if (data.type === "expectedString") {
          // setting expected and display
          const temp = data.payload.split("").map((char, i) => {
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
          timerRef.current = setInterval(() => {
            setTimer((cur) => cur + 1);
          }, 1000);
          displayWsRef.current = setInterval(() => {
            ws.send(
              JSON.stringify({ type: "myDisplay", payload: displayRef.current })
            );
          }, 100);
        } else if (data.type === "allPlayerDisplay") {
          setAllPlayerInfo(
            data.payload.filter(
              (val, i) => val.playerId !== playerIdRef.current
            )
          );
        }
      } catch (error) {
        console.error("Invalid JSON:", error);
      }
    };
    ws.onclose = () => console.log("connection closed");
    setSocket(ws);
    () => ws.close();
  }, []);

  // to initially load expected array
  useEffect(() => {
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
    displayRef.current = display; //IMP USE OF REF

    let totalWord = 0;
    // let correctWord = 0;
    let totalChar = 0;
    let correctChar = 0;
    for (let i = 0; i < display.length; i++) {
      const charDetails = display[i];
      if (display[i].inputChar === "") {
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

  function handleStart() {
    const resObj = { type: "startTest", payload: "start" };
    socket.send(JSON.stringify(resObj));
  }

  useEffect(() => {
    if (timer === 60) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      clearInterval(displayWsRef.current);
      displayWsRef.current = null;
    }
  }, [timer]);

  // useEffect(() => {
  //   if (!displayWsRef.current && socket) {
  //     displayWsRef.current = setInterval(() => {
  //       socket.send(
  //         JSON.stringify({ type: "myDisplay", display: displayRef.current })
  //       );
  //     }, 1000);
  //   }

  //   return () => clearInterval(displayWsRef.current); // Cleanup on unmount
  // }, [socket]); // Only depend on socket, not display

  return (
    <>
      <div className="mb-5 self-start">Start Typing</div>
      <div className="mb-5 self-start flex items-center">
        <div className="text-amber-200">Time :</div>
        <div className="ml-1">
          {timer}
          <span className="ml-0.5">sec</span>
        </div>
        {timer === 0 && (
          <div
            className="bg-blue-400 rounded-xl px-1 ml-5 cursor-pointer"
            onClick={handleStart}
          >
            Start
          </div>
        )}
      </div>
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
          <div className="flex flex-wrap">
            {console.log(display)}
            {Array.isArray(display)}
            {display?.map((charDetails, i) => (
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
      <StatsDisplay stats={stats} />
      {allPlayerInfo[0] !== undefined &&
        allPlayerInfo?.map((val, i) => (
          <div key={i} className="flex flex-col mb-8">
            <div className="self-start mb-2">Player - {val.playerId}</div>
            <Display display={val.display} />
          </div>
        ))}
    </>
  );
}

export default App;
