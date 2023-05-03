import { Application } from "pixi.js";
import Coach from "./coach";
import FieldPlayer from "./fieldplayer";
import GoalKeeper from "./goalkeeper";
import Position from "./interface/position";
import Ball from "./ball";
import Match from "./match";
import Player from "./player";
import { POSITION_TYPE } from "./interface/positiontypes";
import { TeamStats } from "./interface/stats";

export default class Team {
  private app: Application;
  public teamName: string;
  private goalKeeper!: GoalKeeper;
  private players!: Map<number, FieldPlayer>;
  private goalPosition!: Position;
  private coach!: Coach;
  private ball!: Ball;
  private score = 0;
  defensiveLine: number = 0;
  defensiveLineDistanceFromBall: number = 150;
  startPlayer: number;
  stats: TeamStats;

  constructor(
    app: Application,
    teamName: string,
    goalPosition: Position,
    startPlayer: number,
    ball: Ball
  ) {
    this.app = app;
    this.teamName = teamName;
    this.goalPosition = goalPosition;
    this.startPlayer = startPlayer;
    this.ball = ball;
    this.stats = {
      teamName: this.teamName,
      score: 0,
      players: [],
    };

    this.calculateDefenseLine();

    this.app.ticker.add(() => {
      if (
        this.ball.getOwner() === null &&
        !this.ball.getOnAir() &&
        !this.ball.getIsMoving()
      ) {
        //If the owner of the ball is null, then try to get the closest player to the ball
        const closest = this.getClosestPlayerToBall();
        if (closest) {
          closest.goToPosition(this.ball.getPosition());
        }
      }
    });
  }

  toJSON() {
    return {
      teamName: this.teamName,
      score: this.score,
      players: Array.from(this.players.values()).map((player) =>
        player.toJSON()
      ),
    };
  }

  getGoalPosition(): Position {
    return { x: this.goalPosition.x + 45, y: this.goalPosition.y };
  }

  getScore() {
    return this.score;
  }

  setScore(score: number) {
    this.score = score;
  }

  getPlayers() {
    return this.players;
  }

  getPlayersByPosition(position: POSITION_TYPE) {
    if (position) {
      const players = Array.from(this.players.values());

      return players.filter(
        (player) => player.getData().position_type === position
      );
    }
  }

  getPlayer(id: number) {
    return this.players.get(id);
  }

  getGoalKeeper() {
    return this.goalKeeper;
  }

  setPlayers(players: Map<number, FieldPlayer>) {
    this.players = players;
  }

  setGoalKeeper(gk: GoalKeeper) {
    this.goalKeeper = gk;
  }

  setCoach(opponent: Team, match: Match) {
    this.coach = new Coach(this.app, this.ball, this, opponent, match);
  }

  getCoach() {
    return this.coach;
  }

  //Get the closest player to the ball
  getClosestPlayerToBall(): FieldPlayer | null {
    let closestPlayer: FieldPlayer | null = null;

    this.players.forEach((player) => {
      if (!closestPlayer) {
        closestPlayer = player;
      } else {
        if (player.getDistanceToBall() < closestPlayer.getDistanceToBall()) {
          closestPlayer = player;
        }
      }
    });

    return closestPlayer;
  }

  //Get the closest player to the owner of the ball (opponent team)
  getClosestPlayerToOwner(): FieldPlayer | null {
    let closestPlayer: FieldPlayer | null = null;

    this.players.forEach((player) => {
      if (player !== this.ball.getOwner()) {
        if (!closestPlayer) {
          closestPlayer = player;
        } else {
          if (
            player.getDistanceToTheOwnerOfBall() <
            closestPlayer.getDistanceToTheOwnerOfBall()
          ) {
            closestPlayer = player;
          }
        }
      }
    });

    return closestPlayer;
  }

  //Calculate defense line
  calculateDefenseLine() {
    this.app.ticker.add(() => {
      const ballPosY = this.ball.getPosition().y;
      const minDist = 70;

      if (this.teamName === "team1") {
        const dist = this.defensiveLineDistanceFromBall + ballPosY;

        if (dist < this.goalPosition.y - minDist) {
          this.defensiveLine = dist;
        } else {
          this.defensiveLine = this.goalPosition.y - minDist;
        }
      } else {
        const dist = ballPosY - this.defensiveLineDistanceFromBall;

        if (dist > this.goalPosition.y + minDist) {
          this.defensiveLine = dist;
        } else {
          this.defensiveLine = this.goalPosition.y + minDist;
        }
      }
    });
  }
}
