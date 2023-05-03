import { Application, Container, Graphics, Text } from "pixi.js";
import Position from "./interface/position";
import Team from "./team";
import PlayerData from "./interface/playerdata";
import { initialPostions } from "./data/initialpositions";
import Ball from "./ball";
import { POSITION_TYPE } from "./interface/positiontypes";
import { Stats } from "./interface/stats";

export default class Player {
  app: Application;
  private container: Container;

  private position: Position;
  private team: Team;
  private opponentTeam: Team;
  private data: PlayerData;
  target: Position;
  ball: Ball;
  private stuckCount: number = 0;
  stats: Stats = {
    goals: 0,
    passesRecieved: 0,
    passesCompleted: 0,
    passesFailed: 0,
    shots: 0,
    interceptions: 0,
  };

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
        (this.target.x - this.position.x) *
          (this.data.speed / 100) *
          delta *
          0.01;
      const y =
        this.position.y +
        (this.target.y - this.position.y) *
          (this.data.speed / 100) *
          delta *
          0.01;

      if (
        this.position.x < this.target.x - 3 ||
        this.position.x > this.target.x + 3 ||
        this.position.y < this.target.y - 3 ||
        this.position.y > this.target.y + 3
      ) {
        this.position = {
          x,
          y,
        };
      }

      this.container.x = this.position.x;
      this.container.y = this.position.y;

      this.claimBall();
    });
  }

  toJSON() {
    return {
      id: this.data.id,
      name: this.data.name,
      position: this.data.position,
      stats: this.stats,
    };
  }

  getOpponentTeam() {
    return this.opponentTeam;
  }

  getTeam() {
    return this.team;
  }

  getData() {
    return this.data;
  }

  getPosition() {
    return this.position;
  }

  setPosition(position: Position) {
    this.position = position;
    this.target = position;
  }

  claimBall() {
    const prevOwner = this.ball.getPreviousOwner();

    if (this.stuckCount > 300) {
      const players = Array.from(this.team.getPlayers().values());
      const randomPlayer = players[Math.floor(Math.random() * players.length)];
      this.ball.setOwner(randomPlayer);
    }

    if (prevOwner) {
      if (
        Math.abs(prevOwner.getPosition().x - this.position.x) < 20 &&
        Math.abs(prevOwner.getPosition().y - this.position.y) < 20
      ) {
        this.stuckCount++;
        return;
      }
    }

    this.stuckCount = 0;

    const radius = 10;
    if (
      this.ball.getOwner() === null &&
      this.ball.getPreviousOwner() !== this
    ) {
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
          const prevOwner = this.ball.getPreviousOwner();
          if (prevOwner !== null) {
            if (this.getTeam() === prevOwner.getTeam()) {
              prevOwner.stats.passesCompleted++;
              this.stats.passesRecieved++;
            } else {
              this.stats.interceptions++;
              prevOwner.stats.passesFailed++;
            }
          }
        }
      }
    }
  }

  passBall(player: Player) {
    if (player === this) return;
    this.ball.setOwner(null);
    this.ball.setTarget(player.getPosition());
  }

  longPassBall(player: Player) {
    this.ball.setOwner(null);
    this.ball.setTarget(player.getPosition());
    this.ball.setOnAir(true);
  }

  goToPosition(position: Position) {
    this.target = position;
  }

  getDistanceToBall() {
    const x = this.ball.getPosition().x - this.position.x;
    const y = this.ball.getPosition().y - this.position.y;

    return Math.sqrt(x * x + y * y);
  }

  getDistanceToTheOwnerOfBall() {
    const owner = this.ball.getOwner();

    if (owner === null) {
      return 1000;
    } else {
      const x = owner.getPosition().x - this.position.x;
      const y = owner.getPosition().y - this.position.y;

      return Math.sqrt(x * x + y * y);
    }
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

  isPassingLaneClear(player: Player) {
    let opponents = Array.from(this.opponentTeam.getPlayers().values());

    let passingLaneClear = true;

    const currPlayerToPasser = Math.sqrt(
      Math.pow(player.getPosition().x - this.position.x, 2) +
        Math.pow(player.getPosition().y - this.position.y, 2)
    );
    opponents.forEach((opponent) => {
      const playerToOpponent = Math.sqrt(
        Math.pow(opponent.getPosition().x - this.position.x, 2) +
          Math.pow(opponent.getPosition().y - this.position.y, 2)
      );

      const opponentToPasser = Math.sqrt(
        Math.pow(opponent.getPosition().x - player.getPosition().x, 2) +
          Math.pow(opponent.getPosition().y - player.getPosition().y, 2)
      );

      if (
        Math.abs(playerToOpponent + opponentToPasser - currPlayerToPasser) < 10
      ) {
        passingLaneClear = false;
      }
    });

    return passingLaneClear;
  }

  sortPlayersByDistance(position?: POSITION_TYPE) {
    let players = Array.from(this.team.getPlayers().values()).filter(
      (player) => {
        if (position) {
          return player.getData().position_type === position;
        } else {
          return true;
        }
      }
    );

    return players.sort((a, b) => {
      return (
        Math.sqrt(
          Math.pow(a.getPosition().x - this.position.x, 2) +
            Math.pow(a.getPosition().y - this.position.y, 2)
        ) -
        Math.sqrt(
          Math.pow(b.getPosition().x - this.position.x, 2) +
            Math.pow(b.getPosition().y - this.position.y, 2)
        )
      );
    });
  }
}
