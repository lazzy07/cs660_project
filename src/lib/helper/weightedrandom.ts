import PlanElement from "../interface/planelement";

export const weightedRandom = (options: PlanElement[]) => {
  let i;
  let weights = [options[0].weight];

  for (i = 1; i < options.length; i++)
    weights[i] = options[i].weight + weights[i - 1];

  let random = Math.random() * weights[weights.length - 1];

  for (i = 0; i < weights.length; i++) if (weights[i] > random) break;

  return options[i];
};
