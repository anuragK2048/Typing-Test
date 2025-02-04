import { useEffect, useState } from "react";
import StatsDisplay from "./StatsDisplay";

function Display({ display = [] }) {
  const [stats, setStats] = useState({
    wordspMin: 0,
    charspMin: 0,
    accuracy: 0,
  });
  useEffect(() => {
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

  return (
    <>
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
      <StatsDisplay stats={stats} />
    </>
  );
}

export default Display;
