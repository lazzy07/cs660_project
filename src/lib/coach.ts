import { Application } from "pixi.js";
import Ball from "./ball";
import Match from "./match";
import Team from "./team";
import { team1Plan, team1Plan2 } from "./data/team1plan";
import { weightedRandom } from "./helper/weightedrandom";
import PlanElement from "./interface/planelement";
import { team2Plan, team2Plan2 } from "./data/team2plan";
import Player from "./player";

export default class Coach {
  private ball: Ball;
  private team: Team;
  private opponent: Team;
  private match: Match;
  private app: Application;
  private isDebug: boolean = false;
  private debugStop: boolean = false;
  private prevOwner: Player | null = null;

  constructor(
    app: Application,
    ball: Ball,
    team: Team,
    opponent: Team,
    match: Match
  ) {
    this.ball = ball;
    this.team = team;
    this.opponent = opponent;
    this.match = match;
    this.app = app;

    this.app.ticker.add(this.update);
  }

  private update = (delta: number) => {
    if (!this.debugStop) {
      if (this.match.getGameStarted()) {
        //First need to check which team has the ball
        const owner = this.ball.getOwner();
        if (owner) {
          if (owner.getTeam().teamName === this.team.teamName) {
            //The team has the ball
            //Load offensive tactics

            if (owner !== this.prevOwner) {
              this.executeOtherPlan(this.getTeamPlan().attackOther);
              this.prevOwner = owner;
            }
            const offensivePlan = this.getTeamPlan().attack;
            this.executePlan(offensivePlan);
          } else {
            //The opponent has the ball
            //Load defensive tactics
            const defensivePlan = this.getTeamPlan().defense;
            if (owner !== this.prevOwner) {
              this.executeOtherPlan(defensivePlan);
              this.prevOwner = owner;
            }
          }
        }
      }
    }
  };

  getTeamPlan = () => {
    if (this.team.teamName === "team1") {
      if (this.match.engineType === 0) {
        return team1Plan(this.match);
      } else {
        return team1Plan2(this.match);
      }
    } else {
      if (this.match.engineType === 0) {
        return team2Plan(this.match);
      } else {
        return team2Plan2(this.match);
      }
    }
  };

  executeOtherPlan = (plan: PlanElement[]) => {
    const players = Array.from(this.team.getPlayers().values());

    players.forEach((player) => {
      const events = plan.filter((event) => {
        return (
          (event.player === player.getData().id ||
            event.position_type === player.getData().position_type) &&
          event.preconditions()
        );
      });

      if (events.length === 0) {
        //console.warn("Other::No event found for this situation", player);
        if (this.isDebug) {
          //console.log(plan);
          this.debugStop = true;
        }

        return;
      }

      const selectedEvent = weightedRandom(events);

      if (selectedEvent) {
        selectedEvent.execute();
      } else {
        console.warn("No event found for this situation", this.ball.getOwner());
        if (this.isDebug) {
          console.log(plan);
          this.debugStop = true;
        }
      }
    });
  };

  executePlan(plan: PlanElement[]) {
    //Get all the events that meet the preconditions
    const events = plan.filter((event) => {
      return event.preconditions();
    });

    if (events.length === 0) {
      console.warn("No event found for this situation");
      if (this.isDebug) {
        console.log(plan);
        this.debugStop = true;
      }

      return;
    }

    const selectedEvent = weightedRandom(events);

    if (selectedEvent) {
      selectedEvent.execute();
    } else {
      console.warn("No event found for this situation");
      if (this.isDebug) {
        console.log(plan);
        this.debugStop = true;
      }
    }
  }
}
