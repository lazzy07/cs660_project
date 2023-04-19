import { Application, Container, Graphics, Text } from "pixi.js";
import Position from "./interface/position";
import Team from "./team";
import PlayerData from "./interface/playerdata";
import { initialPostions } from "./data/initialpositions";
import Ball from "./ball";

export default class Player {
  app: Application;
  private container: Container;

  private position: Position;
  private team: Team;
  private opponentTeam: Team;
  private data: PlayerData;
  target: Position;
  ball: Ball;

  constructor(
    app: Application,
    team: Team,
    opponentTeam: Team,
    ball: Ball,
    playerData: PlayerData
  ) {
    this.app = app;
    this.team = team;
    this.opponentTeam = opponentTeam;
    this.data = playerData;
    this.ball = ball;
    this.container = new Container();

    this.position = initialPostions(
      this.team.teamName === "team1",
      this.data.position
    );

    this.target = this.position;
    this.init();

    this.app.ticker.add((delta) => {
      const x =
        this.position.x +
        (this.target.x - this.position.x) * 0.008 * (this.data.speed / 100);
      const y =
        this.position.y +
        (this.target.y - this.position.y) * 0.008 * (this.data.speed / 100);

      this.position = {
        x,
        y,
      };

      this.container.x = this.position.x;
      this.container.y = this.position.y;

      this.claimBall();
    });
  }

  getData() {
    return this.data;
  }

  getPosition() {
    return this.position;
  }

  claimBall() {
    const radius = 7;
    if (this.ball.getOwner() === null) {
      if (
        this.ball.getPosition().x > this.position.x - radius &&
        this.ball.getPosition().x < this.position.x + radius
      ) {
        if (
          this.ball.getPosition().y > this.position.y - radius &&
          this.ball.getPosition().y < this.position.y + radius
        ) {
          console.log(this.data.name + " claims the ball");
          this.ball.setOwner(this);
        }
      }
    }
  }

  passBall(player: Player) {
    this.ball.setOwner(null);
    this.ball.setTarget(player.getPosition());
  }

  goToPosition(position: Position) {
    this.target = position;
  }

  init() {
    const basicText = new Text(this.data.name, {
      fontFamily: "Arial",
      fontSize: 9,
      fill: 0xffffff,
      align: "center",
    });
    basicText.x = this.container.x;
    basicText.y = this.container.y + 14;

    const graphics = new Graphics();

    if (this.team.teamName === "team1") {
      graphics.beginFill(0xde3249, 1);
    } else {
      graphics.beginFill(0x4a77d4, 1);
    }

    graphics.drawCircle(this.container.x, this.container.y, 7);
    graphics.endFill();

    this.container.addChild(graphics);
    this.container.addChild(basicText);
    this.app.stage.addChild(this.container);
  }
}
