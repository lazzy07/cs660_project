import { Application } from "pixi.js";
import Player from "./player";
import Ball from "./ball";
import Team from "./team";
import PlayerData from "./interface/playerdata";
import Position from "./interface/position";

export default class GoalKeeper extends Player {
  private prevPos: Position = { x: 0, y: 0 };

  constructor(
    app: Application,
    team: Team,
    opponentTeam: Team,
    ball: Ball,
    playerData: PlayerData
  ) {
    super(app, team, opponentTeam, ball, playerData);

    this.app.ticker.add((delta) => {
      this.setGoalkeeperPosition();
    });
  }

  //Set goalkeeper position between the ball and the goal
  setGoalkeeperPosition() {
    let ballPos = this.prevPos;

    if (this.ball.getOwner()) {
      this.prevPos = this.ball.getOwner()!.getPosition();
      ballPos = this.ball.getOwner()!.getPosition();
    }

    const posX = (this.getTeam().getGoalPosition().x - ballPos.x) / 2;

    const pos = {
      x: this.getTeam().getGoalPosition().x - posX,
      y: this.getPosition().y,
    };

    this.setPosition(pos);
  }
}
