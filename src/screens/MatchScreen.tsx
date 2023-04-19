import React, { createRef, useEffect, useState } from "react";
import { Application } from "pixi.js";
import Match from "../lib/match";

export default function MatchScreen() {
  let divElement = createRef<HTMLDivElement>();

  let [match, setMatch] = useState<Match | null>(null);
  let [input, setInput] = useState("");

  useEffect(() => {
    const app = new Application({ width: 500, height: 750 });
    divElement.current!.appendChild(app.view as any);

    setMatch(new Match(app));
  }, []);

  const executeCommand = () => {
    console.log("executing command: " + input);
    if (match) {
      eval(input);
    } else {
      console.log("match is null");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div ref={divElement} />
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={() => executeCommand()}>Send</button>
      </div>
    </div>
  );
}
