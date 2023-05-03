import { Application, Graphics } from "pixi.js";

export default class Ground {
  private app: Application;
  groundStart = [25, 50];

  constructor(app: Application) {
    this.app = app;

    this.drawSoccerField();
  }

  drawSoccerField() {
    const field = new Graphics();

    //Drawing ground
    field.beginFill(0x173518);
    field.lineStyle(2, 0xffffff, 1);
    field.drawRect(this.groundStart[0], this.groundStart[1], 450, 650);
    field.endFill();

    //Penalty box1
    field.lineStyle(2, 0xffffff, 1);
    field.drawRect(this.groundStart[0] + 105, this.groundStart[1], 240, 120);
    field.endFill();

    //Penalty box2
    field.lineStyle(2, 0xffffff, 1);
    field.drawRect(
      this.groundStart[0] + 105,
      this.groundStart[1] + 650 - 120,
      240,
      120
    );
    field.endFill();

    //Goal1
    field.lineStyle(2, 0xffffff, 1);
    field.drawRect(
      this.groundStart[0] + 105 + 70,
      this.groundStart[1] - 10,
      90,
      10
    );
    field.endFill();

    //Goal2
    field.lineStyle(2, 0xffffff, 1);
    field.drawRect(
      this.groundStart[0] + 105 + 70,
      this.groundStart[1] + 650,
      90,
      10
    );
    field.endFill();

    //Middle line
    field.lineStyle(1, 0xffffff, 1);
    field.drawRect(this.groundStart[0], this.groundStart[1] + 650 / 2, 450, 1);
    field.endFill();

    this.app.stage.addChild(field);
  }
}
