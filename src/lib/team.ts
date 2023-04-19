import { Application } from "pixi.js";
import Coach from "./coach";
import FieldPlayer from "./fieldplayer";
import GoalKeeper from "./goalkeeper";

export default class Team {
  private app: Application;
  public teamName: string;
  private coach = new Coach();
  private goalKeeper!: GoalKeeper;
  private players!: Map<number, FieldPlayer>;

  constructor(app: Application, teamName: string) {
    this.app = app;
    this.teamName = teamName;
  }

  getPlayers() {
    return this.players;
  }

  getPlayer(id: number) {
    return this.players.get(id);
  }

  getGoalKeeper() {
    return this.goalKeeper;
  }

  setPlayers(players: Map<number, FieldPlayer>) {
    this.players = players;
  }

  setGoalKeeper(gk: GoalKeeper) {
    this.goalKeeper = gk;
  }
}
