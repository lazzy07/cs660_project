import { ZONE_TYPES } from "./interface/zonetypes";
import { Application } from "pixi.js";
import Ball from "./ball";
import Team from "./team";
import ZoneElem from "./zoneelem";
import Player from "./player";
import Position from "./interface/position";

export default class ZoneManager {
  private app: Application;
  private ball: Ball;
  private team1: Team;
  private team2: Team;
  private zones: ZoneElem[];

  constructor(app: Application, ball: Ball, team1: Team, team2: Team) {
    this.app = app;
    this.ball = ball;
    this.team1 = team1;
    this.team2 = team2;

    this.zones = [
      new ZoneElem(
        0,
        this.app,
        { x: 25, y: 50 },
        { x: 105, y: 140 },
        this.team1,
        this.team2,
        0xff0000
      ),
      new ZoneElem(
        1,
        this.app,
        { x: 130, y: 50 },
        { x: 240, y: 140 },
        this.team1,
        this.team2,
        0x00ff00
      ),
      new ZoneElem(
        2,
        this.app,
        { x: 370, y: 50 },
        { x: 105, y: 140 },
        this.team1,
        this.team2,
        0x0000ff
      ),
      new ZoneElem(
        3,
        this.app,
        { x: 25, y: 190 },
        { x: 150, y: 185 },
        this.team1,
        this.team2,
        0x00ffff
      ),
      new ZoneElem(
        4,
        this.app,
        { x: 175, y: 190 },
        { x: 150, y: 185 },
        this.team1,
        this.team2,
        0x0033ff
      ),
      new ZoneElem(
        5,
        this.app,
        { x: 325, y: 190 },
        { x: 150, y: 185 },
        this.team1,
        this.team2,
        0x23ff45
      ),
      new ZoneElem(
        6,
        this.app,
        { x: 25, y: 375 },
        { x: 150, y: 185 },
        this.team1,
        this.team2,
        0xff00ff
      ),
      new ZoneElem(
        7,
        this.app,
        { x: 175, y: 375 },
        { x: 150, y: 185 },
        this.team1,
        this.team2,
        0xff0000
      ),
      new ZoneElem(
        8,
        this.app,
        { x: 325, y: 375 },
        { x: 150, y: 185 },
        this.team1,
        this.team2,
        0x0000ff
      ),

      new ZoneElem(
        9,
        this.app,
        { x: 25, y: 560 },
        { x: 105, y: 140 },
        this.team1,
        this.team2,
        0xff0000
      ),
      new ZoneElem(
        10,
        this.app,
        { x: 130, y: 560 },
        { x: 240, y: 140 },
        this.team1,
        this.team2,
        0x00ff00
      ),
      new ZoneElem(
        11,
        this.app,
        { x: 370, y: 560 },
        { x: 105, y: 140 },
        this.team1,
        this.team2,
        0x0000ff
      ),
    ];
  }

  drawDebug() {
    this.zones.forEach((zone) => {
      zone.setDraw(true);
    });
  }

  stopDebug() {
    this.zones.forEach((zone) => {
      zone.setDraw(false);
    });
  }

  canGoToZone(zone: number, player: Player) {
    return this.zones[zone].canGoTo(player);
  }

  getRandomPos(zone: number, opponent: Team) {
    return this.zones[zone].getARandomPosition(opponent);
  }

  isPositionInZone(zone: number, pos: Position) {
    return this.zones[zone].isPositionInZone(pos);
  }

  getZone(zone: number) {
    return this.zones[zone];
  }
}
