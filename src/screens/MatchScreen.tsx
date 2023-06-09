import React, { createRef, useEffect, useState } from "react";
import { Application } from "pixi.js";
import Match from "../lib/match";
import Countdown from "react-countdown";

export default function MatchScreen() {
  let divElement = createRef<HTMLDivElement>();
  let timerRef = createRef<Countdown>();

  let [match, setMatch] = useState<Match | null>(null);
  let [input, setInput] = useState("");
  let [commands, setCommands] = useState<string[]>([]);
  let [variables, setVariables] = useState<any>({});
  let [json, setJson] = useState<string>("");

  const setVar = (name: string, value: any) => {
    console.log("setting variable", name, value);
    setVariables({ ...variables, [name]: value });
  };

  const startMatch = () => {
    if (match) {
      startCountdown();
      match.setGameStarted(true);
    }
  };

  const startCountdown = () => {
    timerRef.current!.start();
  };

  const stopCountdown = () => {
    timerRef.current!.stop();
  };

  const getVar = (name: string) => {
    return variables[name];
  };

  useEffect(() => {
    const app = new Application({ width: 500, height: 750 });
    divElement.current!.appendChild(app.view as any);

    setMatch(new Match(app));
  }, []);

  const executeCommand = () => {
    setInput("");
    if (match) {
      setCommands([...commands, input]);
      try {
        eval(input);
      } catch (e) {
        console.error(e);
      }
    } else {
      console.log("match is null");
    }
  };

  const toJSON = () => {
    setJson(JSON.stringify(match!.toJSON(), null, 2));
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div ref={divElement} />
        <div style={{ padding: 30 }}>
          <div style={{ fontSize: 30 }}>
            <Countdown
              ref={timerRef}
              autoStart={false}
              date={Date.now() + 300000}
            />
          </div>
          <div
            style={{
              minHeight: 500,
              width: 600,
              overflow: "scroll",
              border: "1px solid black",
              padding: 10,
            }}
          >
            {commands.map((command, index) => (
              <div key={index}>{command}</div>
            ))}
          </div>
          <input
            style={{ width: 400 }}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={() => executeCommand()}>Send</button>
        </div>
      </div>
      {json && <div>{json}</div>}
    </div>
  );
}
