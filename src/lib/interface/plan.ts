import PlanElement from "./planelement";

export default interface Plan {
  attack: PlanElement[];
  attackOther: PlanElement[];
  defense: PlanElement[];
}
