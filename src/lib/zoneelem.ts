import Player from "./player";
import Position from "./interface/position";
import Rect from "./interface/rect";
import { Application, Graphics } from "pixi.js";
import Team from "./team";

export default class ZoneElem {
  private id: number;
  private app: Application;
  private position: Position;
  private size: Position;
  team1Players: Player[];
  team2Players: Player[];
  private team1: Team;
  private team2: Team;
  private graphics!: Graphics;
  private color: number;
  private shouldDraw: boolean = false;

  constructor(
    id: number,
    app: Application,
    position: Position,
    size: Position,
    team1: Team,
    team2: Team,
    color: number = 0x000000
  ) {
    this.id = id;
    this.position = position;
    this.size = size;
    this.team1Players = [] as Player[];
    this.team2Players = [] as Player[];
    this.app = app;
    this.team1 = team1;
    this.team2 = team2;
    this.color = color;
    this.draw();
    this.app.ticker.add(this.update);
  }

  setDraw = (shouldDraw: boolean) => {
    this.shouldDraw = shouldDraw;
  };

  update = () => {
    if (this.shouldDraw) {
      this.graphics.visible = true;
    } else {
      this.graphics.visible = false;
    }

    this.team1Players = [] as Player[];
    this.team2Players = [] as Player[];

    this.team1.getPlayers().forEach((player) => {
      if (
        player.getPosition().x >= this.position.x &&
        player.getPosition().x < this.position.x + this.size.x &&
        player.getPosition().y >= this.position.y &&
        player.getPosition().y < this.position.y + this.size.y
      ) {
        this.team1Players.push(player);
      }
    });

    this.team2.getPlayers().forEach((player) => {
      if (
        player.getPosition().x > this.position.x &&
        player.getPosition().x <= this.position.x + this.size.x &&
        player.getPosition().y > this.position.y &&
        player.getPosition().y <= this.position.y + this.size.y
      ) {
        this.team2Players.push(player);
      }
    });
  };

  draw = () => {
    this.graphics = new Graphics();
    this.graphics.beginFill(this.color);
    this.graphics.drawRect(
      this.position.x,
      this.position.y,
      this.size.x,
      this.size.y
    );
    this.graphics.alpha = 0.1;
    this.graphics.endFill();
    this.app.stage.addChild(this.graphics);
  };

  canGoTo = (player: Player): boolean => {
    const opponent = player.getOpponentTeam();
    if (opponent === this.team1) {
      return opponent.defensiveLine > this.position.y;
    } else {
      return opponent.defensiveLine < this.position.y + this.size.y;
    }
  };

  getARandomPosition = (opponent: Team): Position => {
    if (opponent === this.team1) {
      return {
        x: this.position.x + Math.random() * this.size.x,
        y:
          this.position.y +
          Math.random() * Math.min(this.size.y, opponent.defensiveLine),
      };
    } else {
      return {
        x: this.position.x + Math.random() * this.size.x,
        y:
          Math.max(this.position.y, opponent.defensiveLine) +
          Math.random() * this.size.y,
      };
    }
  };

  isPositionInZone = (position: Position): boolean => {
    return (
      position.x >= this.position.x &&
      position.x <= this.position.x + this.size.x &&
      position.y >= this.position.y &&
      position.y <= this.position.y + this.size.y
    );
  };
}
