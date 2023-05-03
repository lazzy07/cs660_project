import Position from "../interface/position";
import Rect from "../interface/rect";

export const isInsideRect = (point: Position, rect: Rect) => {
  return (
    point.x >= rect.left &&
    point.x <= rect.right &&
    point.y >= rect.top &&
    point.y <= rect.bottom
  );
};
