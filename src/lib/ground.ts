import { Application, Graphics } from "pixi.js";

export default class Ground {
  private app: Application;

  constructor(app: Application) {
    this.app = app;

    this.drawSoccerField();
  }

  drawSoccerField() {
    const field = new Graphics();
    const groundStart = [25, 50];

    //Drawing ground
    field.beginFill(0x173518);
    field.lineStyle(2, 0xffffff, 1);
    field.drawRect(groundStart[0], groundStart[1], 450, 650);
    field.endFill();

    //Penalty box1
    field.lineStyle(2, 0xffffff, 1);
    field.drawRect(groundStart[0] + 105, groundStart[1], 240, 120);
    field.endFill();

    //Penalty box2
    field.lineStyle(2, 0xffffff, 1);
    field.drawRect(groundStart[0] + 105, groundStart[1] + 650 - 120, 240, 120);
    field.endFill();

    //Goal1
    field.lineStyle(2, 0xffffff, 1);
    field.drawRect(groundStart[0] + 105 + 70, groundStart[1] - 10, 90, 10);
    field.endFill();

    //Goal2
    field.lineStyle(2, 0xffffff, 1);
    field.drawRect(groundStart[0] + 105 + 70, groundStart[1] + 650, 90, 10);
    field.endFill();

    //Middle line
    field.lineStyle(1, 0xffffff, 1);
    field.drawRect(groundStart[0], groundStart[1] + 650 / 2, 450, 1);
    field.endFill();

    this.app.stage.addChild(field);
  }
}
