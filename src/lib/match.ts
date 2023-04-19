import { Application } from "pixi.js";
import Team from "./team";
import Ground from "./ground";
import { team1Players } from "./data/team1players";
import { team2Players } from "./data/team2players";
import FieldPlayer from "./fieldplayer";
import GoalKeeper from "./goalkeeper";
import Ball from "./ball";

export default class Match {
  private app: Application;

  team1: Team;
  team2: Team;

  private ground: Ground;
  ball: Ball;

  constructor(app: Application) {
    this.app = app;

    this.team1 = new Team(app, "team1");
    this.team2 = new Team(app, "team2");
    this.ground = new Ground(app);
    this.ball = new Ball(app);

    this.init();
    this.ball.render();

    this.ball.setOwner(this.team1.getPlayer(9)!);

    // this.team1.getPlayer(4)!.defend(this.team2.getPlayer(23)!);

    // this.team1
    //   .getPlayer(20)
    //   ?.cutPassingLane(this.team2.getPlayer(11)!, this.team2.getPlayer(10)!);

    // setTimeout(() => {
    //   this.team1.getPlayer(9)!.passBall(this.team2.getPlayer(23)!);
    // }, 3000);
  }

  init() {
    const team1 = new Map<number, FieldPlayer>();
    const team2 = new Map<number, FieldPlayer>();

    for (const data of team1Players) {
      if (data.position !== "GK") {
        const player = new FieldPlayer(
          this.app,
          this.team1,
          this.team2,
          this.ball,
          data
        );
        team1.set(data.id, player);
      } else {
        const gk = new GoalKeeper(
          this.app,
          this.team1,
          this.team2,
          this.ball,
          data
        );
        this.team1.setGoalKeeper(gk);
      }
    }

    for (const data of team2Players) {
      if (data.position !== "GK") {
        const player = new FieldPlayer(
          this.app,
          this.team2,
          this.team1,
          this.ball,
          data
        );
        team2.set(data.id, player);
      } else {
        const gk = new GoalKeeper(
          this.app,
          this.team2,
          this.team1,
          this.ball,
          data
        );
        this.team1.setGoalKeeper(gk);
      }
    }

    this.team1.setPlayers(team1);
    this.team2.setPlayers(team2);
  }
}
