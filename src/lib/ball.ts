import { Application, Graphics } from "pixi.js";
import Position from "./interface/position";
import Player from "./player";

export default class Ball {
  private app: Application;
  private owner: Player | null = null;
  private position: Position;
  private target: Position;
  private speed: number = 100;
  private sprite: Graphics;
  private previousOwner: Player | null = null;
  private onAir: boolean = false;
  private isMoving: boolean = false;

  constructor(app: Application) {
    this.app = app;
    this.sprite = new Graphics();

    this.position = {
      x: 0,
      y: 0,
    };

    this.target = {
      x: 0,
      y: 0,
    };
    this.render();

    this.app.ticker.add((delta) => {
      if (this.target.x - this.position.x > 10) {
        this.isMoving = true;
      } else {
        this.isMoving = false;
      }

      if (this.owner) {
        this.position = {
          x: this.owner.getPosition().x + 7,
          y: this.owner.getPosition().y + 7,
        };
      } else {
        const x =
          this.position.x +
          (this.target.x - this.position.x) * delta * 0.04 * (this.speed / 100);
        const y =
          this.position.y +
          (this.target.y - this.position.y) * delta * 0.04 * (this.speed / 100);

        this.position = {
          x,
          y,
        };
      }

      this.sprite.x = this.position.x;
      this.sprite.y = this.position.y;

      if (this.onAir) {
        if (
          Math.abs(this.target.x - this.position.x) < 30 &&
          Math.abs(this.target.y - this.position.y) < 30
        ) {
          this.onAir = false;
        }
      }
    });
  }

  getIsMoving() {
    return this.isMoving;
  }

  setOwner(player: Player | null) {
    if (this.owner) {
      this.previousOwner = this.owner;
    }
    this.owner = player;
  }

  getPreviousOwner() {
    return this.previousOwner;
  }

  getOwner() {
    return this.owner;
  }

  setTarget(position: Position) {
    this.target = position;
  }

  getTarget() {
    return this.target;
  }

  setPosition(position: Position) {
    this.position = position;
  }

  getPosition() {
    return this.position;
  }

  setSpeed(speed: number) {
    this.speed = speed;
  }

  getSpeed() {
    return this.speed;
  }

  getOnAir() {
    return this.onAir;
  }

  setOnAir(onAir: boolean) {
    this.onAir = onAir;
  }

  render() {
    this.sprite.beginFill(0xffffff, 1);
    this.sprite.drawCircle(this.position.x, this.position.y, 5);
    this.sprite.endFill();

    this.app.stage.addChild(this.sprite);
  }
}
