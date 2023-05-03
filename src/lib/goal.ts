import { Application, Graphics } from "pixi.js";
import Match from "./match";

export default class Goal {
  private app: Application;
  private x: number;
  private y: number;

  constructor(app: Application, x: number, y: number, match: Match) {
    this.app = app;
    this.x = x;
    this.y = y;

    this.init();

    this.app.ticker.add(() => {
      //If the ball hits the gall then score a goal
      if (
        match.ball.getPosition().x > this.x &&
        match.ball.getPosition().x < this.x + 90 &&
        match.ball.getPosition().y > this.y - 2 &&
        match.ball.getPosition().y < this.y + 2
      ) {
        match.resetPositions();

        //Scored team
        const team = match.ball.getPreviousOwner()!.getTeam();
        match.ball.getPreviousOwner()!.stats.goals += 1;
        team.setScore(team.getScore() + 1);
        match.ball.setOwner(team.getPlayer(team.startPlayer)!);
        match.resetPositions();

        console.log(team.teamName + " scored a goal");
      }
    });
  }

  //Draw the goal
  init() {
    const goal = new Graphics();
    goal.beginFill(0xff0000);
    goal.drawRect(0, 0, 90, 2);
    goal.endFill();
    goal.x = this.x;
    goal.y = this.y;
    this.app.stage.addChild(goal);
  }
}
