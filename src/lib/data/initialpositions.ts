import Position from "../interface/position";
import { PLAYER_POSITIONS } from "./../interface/playerpositions";

const groundWidth = 450;
const groundHeight = 650;

const groundStartX = 25;
const groundStartY = 50;

const convertInitialPositions = (isFirstTeam: boolean, position: Position) => {
  return {
    x:
      groundStartX + groundWidth / 2 + (isFirstTeam ? -position.x : position.x),
    y:
      groundStartY +
      groundHeight / 2 +
      (isFirstTeam ? position.y : -position.y),
  };
};

export const initialPostions = (
  isFirstTeam: boolean,
  position: PLAYER_POSITIONS
): Position => {
  switch (position) {
    case "LW": {
      const pos = convertInitialPositions(isFirstTeam, { x: 160, y: 60 });
      return {
        x: pos.x,
        y: pos.y,
      };
    }
    case "ST": {
      const pos = convertInitialPositions(isFirstTeam, { x: 0, y: 40 });
      return {
        x: pos.x,
        y: pos.y,
      };
    }
    case "RW": {
      const pos = convertInitialPositions(isFirstTeam, { x: -160, y: 60 });
      return {
        x: pos.x,
        y: pos.y,
      };
    }
    case "LCM": {
      const pos = convertInitialPositions(isFirstTeam, { x: 130, y: 130 });
      return {
        x: pos.x,
        y: pos.y,
      };
    }
    case "CM": {
      const pos = convertInitialPositions(isFirstTeam, { x: 0, y: 130 });
      return {
        x: pos.x,
        y: pos.y,
      };
    }
    case "RCM": {
      const pos = convertInitialPositions(isFirstTeam, { x: -130, y: 130 });
      return {
        x: pos.x,
        y: pos.y,
      };
    }
    case "LB": {
      const pos = convertInitialPositions(isFirstTeam, { x: 185, y: 185 });
      return {
        x: pos.x,
        y: pos.y,
      };
    }
    case "LCB": {
      const pos = convertInitialPositions(isFirstTeam, { x: 45, y: 185 });
      return {
        x: pos.x,
        y: pos.y,
      };
    }
    case "RCB": {
      const pos = convertInitialPositions(isFirstTeam, { x: -45, y: 185 });
      return {
        x: pos.x,
        y: pos.y,
      };
    }
    case "RB": {
      const pos = convertInitialPositions(isFirstTeam, { x: -185, y: 185 });
      return {
        x: pos.x,
        y: pos.y,
      };
    }
    case "GK": {
      const pos = convertInitialPositions(isFirstTeam, { x: 0, y: 300 });
      return {
        x: pos.x,
        y: pos.y,
      };
    }
    default:
      return {
        x: 0,
        y: 0,
      };
  }
};
