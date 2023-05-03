import { Application } from "pixi.js";
import Team from "./team";
import Ground from "./ground";
import { team1Players } from "./data/team1players";
import { team2Players } from "./data/team2players";
import FieldPlayer from "./fieldplayer";
import GoalKeeper from "./goalkeeper";
import Ball from "./ball";
import Goal from "./goal";
import Position from "./interface/position";
import { initialPostions } from "./data/initialpositions";
import Coach from "./coach";
import ZoneManager from "./zonemanager";

export default class Match {
  private app: Application;
  private gameStarted: boolean = false;

  team1: Team;
  team2: Team;

  private goal1: Goal;
  private goal2: Goal;

  private ground: Ground;
  zoneManager: ZoneManager;
  ball: Ball;
  engineType: number = 0;

  constructor(app: Application) {
    this.app = app;
    this.ground = new Ground(app);

    const goalPosition1: Position = {
      x: this.ground.groundStart[0] + 105 + 70,
      y: this.ground.groundStart[1],
    };

    const goalPosition2: Position = {
      x: this.ground.groundStart[0] + 105 + 70,
      y: this.ground.groundStart[1] + 650,
    };

    this.ball = new Ball(app);

    this.team1 = new Team(app, "team1", goalPosition2, 9, this.ball);
    this.team2 = new Team(app, "team2", goalPosition1, 10, this.ball);

    this.goal1 = new Goal(app, goalPosition1.x, goalPosition1.y, this);
    this.goal2 = new Goal(app, goalPosition2.x, goalPosition2.y, this);

    this.team1.setCoach(this.team2, this);
    this.team2.setCoach(this.team1, this);

    this.init();
    this.ball.render();

    this.ball.setOwner(this.team1.getPlayer(9)!);
    this.zoneManager = new ZoneManager(app, this.ball, this.team1, this.team2);
    this.checkOutOfBounds();
  }

  toJSON() {
    return {
      team1: this.team1.toJSON(),
      team2: this.team2.toJSON(),
    };
  }

  setEngine(num: number) {
    this.engineType = num;
  }

  setGameStarted(gameStarted: boolean) {
    this.gameStarted = gameStarted;
  }

  getCoach(team: Team) {
    return team.getCoach();
  }

  getGameStarted() {
    return this.gameStarted;
  }

  init() {
    const team1 = new Map<number, FieldPlayer>();
    const team2 = new Map<number, FieldPlayer>();

    for (const data of team1Players) {
      if (data.position !== "GK") {
        const player = new FieldPlayer(
          this.app,
          this.team1,
          this.team2,
          this.ball,
          data
        );
        team1.set(data.id, player);
      } else {
        const gk = new GoalKeeper(
          this.app,
          this.team1,
          this.team2,
          this.ball,
          data
        );
        this.team1.setGoalKeeper(gk);
      }
    }

    for (const data of team2Players) {
      if (data.position !== "GK") {
        const player = new FieldPlayer(
          this.app,
          this.team2,
          this.team1,
          this.ball,
          data
        );
        team2.set(data.id, player);
      } else {
        const gk = new GoalKeeper(
          this.app,
          this.team2,
          this.team1,
          this.ball,
          data
        );
        this.team1.setGoalKeeper(gk);
      }
    }

    this.team1.setPlayers(team1);
    this.team2.setPlayers(team2);
  }

  resetPositions() {
    this.team1.getPlayers().forEach((player) => {
      const position = player.getData().position;
      const newPos = initialPostions(true, position);
      player.setPosition(newPos);
    });

    this.team2.getPlayers().forEach((player) => {
      const position = player.getData().position;
      const newPos = initialPostions(false, position);
      player.setPosition(newPos);
    });
  }

  //If the ball goes out of bounds, give the ball to the closest opponent
  checkOutOfBounds() {
    this.app.ticker.add(() => {
      const groundStart = [25, 50];
      if (
        this.ball.getPosition().x < 22 ||
        this.ball.getPosition().x > 480 ||
        this.ball.getPosition().y < 45 ||
        this.ball.getPosition().y > 705
      ) {
        const owner = this.ball.getOwner()
          ? this.ball.getOwner()
          : this.ball.getPreviousOwner();
        if (owner) {
          const team =
            owner.getTeam().teamName === "team1" ? this.team2 : this.team1;
          const closestPlayer = team.getClosestPlayerToBall();

          if (closestPlayer) {
            this.ball.setOwner(closestPlayer);
          }
        }
      }
    });
  }
}
