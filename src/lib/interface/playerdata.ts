import { PLAYER_POSITIONS } from "./playerpositions";
import { POSITION_TYPE } from "./positiontypes";

export default interface PlayerData {
  id: number;
  position_type: POSITION_TYPE;
  position: PLAYER_POSITIONS;
  name: string;
  speed: number;
  shortPass: number;
  longPass: number;
  throughPass: number;
  defence: number;
  shot: number;
}
