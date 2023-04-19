import { isLarger } from "./helper";
import Position from "./interface/position";
import Player from "./player";

export default class FieldPlayer extends Player {
  private state: string = "idle";

  cutPassingLane(player1: Player, player2: Player) {
    this.state = "cutPassingLane";
    console.log(
      this.getData().name +
        " is cutting the passing lane " +
        player1.getData().name +
        " and " +
        player2.getData().name
    );

    this.app.ticker.add((delta) => {
      if (this.state === "cutPassingLane") {
        let middlePoint = {
          x: (player1.getPosition().x + player2.getPosition().x) / 2,
          y: (player1.getPosition().y + player2.getPosition().y) / 2,
        };
        this.goToPosition(middlePoint);
      }
    });
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
    console.log(
      this.getData().name + " is defending " + playerToDefend.getData().name
    );

    this.app.ticker.add((delta) => {
      if (this.state === "defend") {
        this.goToPosition({
          x: playerToDefend.getPosition().x + 10,
          y: playerToDefend.getPosition().y + 10,
        });
      }
    });
  }

  shoot() {
    // if(this.ball.getOwner() === this) {
    //   this.state = "shoot";
    //   this.ball.setTarget({
    //     x: this.position.x + 100,
    //     y: this.position.y + 100,
    //   });
    // }
  }

  goToPosition(position: Position) {
    this.target = position;
  }

  clearState() {
    this.state = "idle";
  }
}
