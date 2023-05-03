import { POSITION_TYPE } from "./positiontypes";

export default interface PlanElement {
  id: number;
  weight: number;
  type: string;
  preconditions: () => boolean;
  execute: () => void;
  player?: number;
  position_type?: POSITION_TYPE;
}
