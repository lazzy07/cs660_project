import Player from "./player";

export default class FieldPlayer extends Player {
  private state: string = "idle";

  cutPassingLane(player1: Player, player2: Player) {
    this.state = "cutPassingLane";

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

  defend(playerToDefend: Player) {
    this.state = "defend";
    this.goToPosition(playerToDefend.getPosition());

    this.app.ticker.add((delta) => {
      if (this.state === "defend") {
        this.goToPosition({
          x: playerToDefend.getPosition().x + 10,
          y: playerToDefend.getPosition().y + 10,
        });
      }
    });
  }
}
