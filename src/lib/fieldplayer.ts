import { Application } from "pixi.js";
import { isLarger } from "./helper";
import Position from "./interface/position";
import Player from "./player";
import Team from "./team";
import Ball from "./ball";
import PlayerData from "./interface/playerdata";
import { initialPostions } from "./data/initialpositions";

export default class FieldPlayer extends Player {
  private state: string = "idle";
  private player1?: Player;
  private player2?: Player;
  private prevOwner?: Player;

  constructor(
    app: Application,
    team: Team,
    opponentTeam: Team,
    ball: Ball,
    playerData: PlayerData
  ) {
    super(app, team, opponentTeam, ball, playerData);

    //listen to keyboard arrows
    window.addEventListener("keydown", (e) => {
      if (this.state === "control") {
        const speed = this.getData().speed / (10 * 1.5);
        if (e.key === "ArrowUp") {
          this.setPosition({
            x: this.getPosition().x,
            y: this.getPosition().y - speed,
          });
        } else if (e.key === "ArrowDown") {
          this.setPosition({
            x: this.getPosition().x,
            y: this.getPosition().y + speed,
          });
        } else if (e.key === "ArrowLeft") {
          this.setPosition({
            x: this.getPosition().x - speed,
            y: this.getPosition().y,
          });
        } else if (e.key === "ArrowRight") {
          this.setPosition({
            x: this.getPosition().x + speed,
            y: this.getPosition().y,
          });
        } else if (e.key === "s") {
          this.shoot();
        }
      }
    });

    this.app.ticker.add((delta) => {
      // if (this.state === "cutPassingLane") {

      // }

      if (this.state === "defend") {
        this.goToPosition({
          x: this.player1!.getPosition().x + 10,
          y: this.player1!.getPosition().y + 10,
        });
      }

      if (this.state === "defensiveLine") {
        const lineY = this.getTeam().defensiveLine;
        const isFirstTeam = this.getTeam().teamName === "team1";
        this.target = {
          x: initialPostions(isFirstTeam, this.getData().position).x,
          y: lineY,
        };
      }
    });
  }

  cutPassingLane(player1: Player, player2: Player) {
    this.player1 = player1;
    this.player2 = player2;

    this.state = "cutPassingLane";

    let middlePoint = {
      x: (this.player1!.getPosition().x + this.player2!.getPosition().x) / 2,
      y: (this.player1!.getPosition().y + this.player2!.getPosition().y) / 2,
    };
    this.goToPosition(middlePoint);

    console.log(
      this.getData().name +
        " is cutting the passing lane " +
        player1.getData().name +
        " and " +
        player2.getData().name
    );
  }

  tackle(player: Player) {
    this.state = "tackle";
    const radius = 20;

    if (this.ball.getOwner() === player) {
      if (
        this.getPosition().x > player.getPosition().x - radius &&
        this.getPosition().x < player.getPosition().x + radius
      ) {
        if (
          this.getPosition().y > player.getPosition().y - radius &&
          this.getPosition().y < player.getPosition().y + radius
        ) {
          if (isLarger(this.getData().defence)) {
            console.log(this.getData().name + " tackled the ball");
            this.ball.setOwner(this);
          } else {
            console.log(this.getData().name + " failed to tackle the ball");
          }
        } else {
          console.log(this.getData().name + " failed to tackle the ball");
        }
      } else {
        console.log(
          "The ball is not owned by " +
            player.getData().name +
            " so " +
            this.getData().name +
            " can't tackle the ball"
        );
      }
    }
  }

  defend(playerToDefend: Player) {
    this.state = "defend";
    this.player1 = playerToDefend;
    console.log(
      this.getData().name + " is defending " + playerToDefend.getData().name
    );
  }

  //Shoot into the goal
  shoot() {
    if (this.ball.getOwner() !== this) {
      console.log(
        this.getData().name + " can't shoot, he doesn't have the ball"
      );
      return;
    }

    console.log(this.getData().name + " shoots");
    const position = this.getOpponentTeam().getGoalPosition();
    this.ball.setOwner(null);
    this.ball.setTarget({
      x: position.x + (Math.random() - 0.5) * (260 - this.getData().shot),
      y: position.y,
    });
    this.ball.setSpeed(this.getData().shot);
    this.stats.shots++;
  }

  goToPosition(position: Position) {
    this.target = position;
  }

  clearState() {
    this.state = "idle";
  }

  //Control this player by the user
  control() {
    this.state = "control";
  }

  goToDefensiveLine() {
    const lineY = this.getTeam().defensiveLine;
    console.log("Going to defensive line " + lineY);
    this.state = "defensiveLine";
  }
}
