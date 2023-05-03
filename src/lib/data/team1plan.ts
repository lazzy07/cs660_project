import { exec } from "child_process";
import Plan from "../interface/plan";
import PlanElement from "../interface/planelement";
import Match from "../match";
import { initialPostions } from "./initialpositions";
import FieldPlayer from "../fieldplayer";

export const team1Plan = (match: Match): Plan => {
  return {
    attack: [
      {
        id: 0,
        weight: 1,
        type: "Any",
        preconditions: () => {
          return true;
        },
        execute: () => {
          const ballOwner = match.ball.getOwner();

          if (ballOwner) {
            const players = Array.from(match.team1.getPlayers().values());
            const randomPlayer =
              players[Math.floor(Math.random() * players.length)];

            if (players) {
              ballOwner.passBall(randomPlayer);
            }
          }
        },
      },
      {
        id: 1,
        weight: 10,
        type: "pass to modric",
        preconditions: () => {
          if (match.ball.getOwner() !== null) {
            if (match.ball.getOwner()?.getData().id === 9) {
              if (
                match.ball
                  .getOwner()
                  ?.isPassingLaneClear(match.team1.getPlayer(10)!)
              )
                return true;
            }
          }

          return false;
        },
        execute: () => {
          console.log("Pass to Modric");
          match.team1.getPlayer(9)?.passBall(match.team1.getPlayer(10)!);
        },
      },
      {
        id: 2,
        weight: 10,
        type: "pass to benzema",
        preconditions: () => {
          if (match.ball.getOwner() !== null) {
            if (
              match.ball.getOwner()!.getData().position_type === "MIDFIELDER" &&
              match.ball
                .getOwner()!
                .isPassingLaneClear(match.team1.getPlayer(9)!)
            ) {
              return true;
            }
          }

          return false;
        },
        execute: () => {
          if (match.ball.getOwner())
            match.ball.getOwner()!.passBall(match.team1.getPlayer(9)!);
        },
      },
      {
        id: 3,
        weight: 1,
        type: "pass back",
        preconditions: () => {
          if (match.ball.getOwner() !== null) {
            if (
              match.ball.getOwner()?.getData().position_type === "MIDFIELDER"
            ) {
              return true;
            }
          }

          return false;
        },
        execute: () => {
          console.log("Pass back to Closest Defender");
          const players = match.ball
            .getOwner()
            ?.sortPlayersByDistance("DEFENDER");

          if (players) {
            if (players[0]) {
              match.ball.getOwner()?.passBall(players[0]);
            }
          }
        },
      },
      {
        id: 4,
        weight: 8,
        type: "pass to Kroos",
        preconditions: () => {
          if (match.ball.getOwner() !== null) {
            if (
              match.ball
                .getOwner()
                ?.isPassingLaneClear(match.team1.getPlayer(8)!)
            ) {
              return true;
            }
          }
          return false;
        },
        execute: () => {
          console.log("Pass to Kroos");
          const owner = match.ball.getOwner();
          if (owner) owner.passBall(match.team1.getPlayer(8)!);
        },
      },
      {
        id: 5,
        weight: 7,
        type: "pass to Midfield",
        preconditions: () => {
          const midfielders = match.team1.getPlayersByPosition("MIDFIELDER");
          if (midfielders) {
            for (const midfielder of midfielders) {
              if (
                match.ball.getOwner() &&
                match.ball.getOwner()!.isPassingLaneClear(midfielder)
              ) {
                return true;
              }
            }
          }
          return false;
        },
        execute: () => {
          const midfielders = match.team1.getPlayersByPosition("MIDFIELDER");

          if (midfielders) {
            for (const midfielder of midfielders) {
              if (midfielder.isPassingLaneClear(midfielder)) {
                if (match.ball.getOwner())
                  return match.ball.getOwner()!.passBall(midfielder);
              }
            }
          }
        },
      },
      {
        id: 6,
        weight: 8,
        type: "pass to Foward",
        preconditions: () => {
          const fowards = match.team1.getPlayersByPosition("STRIKER");
          if (fowards) {
            for (const foward of fowards) {
              if (
                match.ball.getOwner() &&
                match.ball.getOwner()!.isPassingLaneClear(foward)
              ) {
                return true;
              }
            }
          }
          return false;
        },
        execute: () => {
          const fowards = match.team1.getPlayersByPosition("STRIKER");

          if (fowards) {
            for (const foward of fowards) {
              if (foward.isPassingLaneClear(foward)) {
                if (match.ball.getOwner())
                  return match.ball.getOwner()!.passBall(foward);
              }
            }
          }
        },
      },
      {
        id: 7,
        weight: 10,
        type: "If the ball is in the side, cross to the area",
        preconditions: () => {
          if (match.ball.getOwner() !== null) {
            if (
              match.zoneManager.isPositionInZone(0, match.ball.getPosition()) ||
              match.zoneManager.isPositionInZone(2, match.ball.getPosition())
            ) {
              if (match.zoneManager.getZone(1).team1Players.length > 0)
                return true;
            }
            return false;
          }
        },
        execute: () => {
          const players = match.zoneManager.getZone(1).team1Players;

          if (players.length > 0) {
            if (players[0]) {
              match.ball.getOwner()?.longPassBall(players[0]);
            }
          }
        },
      },
      {
        id: 8,
        weight: 12,
        type: "If Vini Jr has the ball run to the side",
        preconditions: () => {
          if (match.ball.getOwner() !== null) {
            if (match.ball.getOwner()!.getData().id === 20) {
              return true;
            }
          }
          return false;
        },
        execute: () => {
          const viniJr = match.team1.getPlayer(20)!;
          viniJr.goToPosition(
            match.zoneManager.getRandomPos(0, viniJr.getOpponentTeam())
          );
        },
      },
      {
        id: 9,
        weight: 8,
        type: "If valverde has the ball run to the side",
        preconditions: () => {
          if (match.ball.getOwner() !== null) {
            if (match.ball.getOwner()!.getData().id === 15) {
              return true;
            }
          }
          return false;
        },
        execute: () => {
          const valverde = match.team1.getPlayer(15)!;
          valverde.goToPosition(
            match.zoneManager.getRandomPos(2, valverde.getOpponentTeam())
          );
        },
      },
      {
        id: 10,
        weight: 600,
        type: "If Benzema has the ball run to the middle",
        preconditions: () => {
          if (match.ball.getOwner() !== null) {
            if (match.ball.getOwner()!.getData().id === 9) {
              return true;
            }
          }
          return false;
        },
        execute: () => {
          const benzema = match.team1.getPlayer(9)!;
          benzema.goToPosition(
            match.zoneManager.getRandomPos(1, benzema.getOpponentTeam())
          );
        },
      },
      {
        id: 11,
        weight: 6,
        type: "If defenders have the ball pass to defenders",
        preconditions: () => {
          if (match.ball.getOwner() !== null) {
            if (match.ball.getOwner()!.getData().position_type === "DEFENDER") {
              return true;
            }
          }
          return false;
        },
        execute: () => {
          const defenders = match.team1.getPlayersByPosition("DEFENDER");

          if (defenders) {
            for (const defender of defenders) {
              if (defender.isPassingLaneClear(defender)) {
                if (match.ball.getOwner())
                  return match.ball.getOwner()!.passBall(defender);
              }
            }
          }
        },
      },
      {
        id: 12,
        weight: 15,
        type: "If defenders have the ball pass to midfielders",
        preconditions: () => {
          if (match.ball.getOwner() !== null) {
            if (match.ball.getOwner()!.getData().position_type === "DEFENDER") {
              return true;
            }
          }
          return false;
        },
        execute: () => {
          const midfielders = match.team1.getPlayersByPosition("MIDFIELDER");

          if (midfielders) {
            for (const midfielder of midfielders) {
              if (midfielder.isPassingLaneClear(midfielder)) {
                if (match.ball.getOwner())
                  return match.ball.getOwner()!.passBall(midfielder);
              }
            }
          }
        },
      },
      {
        id: 13,
        weight: 20,
        type: "Shoot if the ball is in the area",
        preconditions: () => {
          const owner = match.ball.getOwner();
          if (owner) {
            if (owner.getData().position_type === "STRIKER") {
              if (owner.getPosition().y < 260) {
                return true;
              }
            }
          }
        },
        execute: () => {
          const owner = match.ball.getOwner();
          if (owner) {
            (owner as FieldPlayer).shoot();
          }
        },
      },
    ],

    /// DEFENSE
    defense: [
      {
        id: 1,
        weight: 10,
        type: "defenders go to defensive line",
        position_type: "DEFENDER",
        preconditions: () => {
          return true;
        },
        execute: () => {
          const defenders = match.team1.getPlayersByPosition("DEFENDER");
          defenders!.forEach((defender) => {
            defender.goToDefensiveLine();
          });
        },
      },
      {
        id: 2,
        weight: 10,
        type: "midfielders cut passing lanes",
        position_type: "MIDFIELDER",
        preconditions: () => {
          if (
            match.zoneManager.isPositionInZone(3, match.ball.getPosition()) ||
            match.zoneManager.isPositionInZone(4, match.ball.getPosition()) ||
            match.zoneManager.isPositionInZone(5, match.ball.getPosition()) ||
            match.zoneManager.isPositionInZone(6, match.ball.getPosition()) ||
            match.zoneManager.isPositionInZone(7, match.ball.getPosition()) ||
            match.zoneManager.isPositionInZone(8, match.ball.getPosition()) ||
            match.zoneManager.isPositionInZone(9, match.ball.getPosition()) ||
            match.zoneManager.isPositionInZone(10, match.ball.getPosition()) ||
            match.zoneManager.isPositionInZone(11, match.ball.getPosition())
          ) {
            return true;
          }
          return false;
        },
        execute: () => {
          const owner = match.ball.getOwner();
          const team1 = match.team1;
          const team2 = match.team2;
          if (owner) {
            team1.getPlayer(10)?.cutPassingLane(owner, team2.getPlayer(6)!);
            team1.getPlayer(14)?.cutPassingLane(owner, team2.getPlayer(3)!);
            team1.getPlayer(8)?.cutPassingLane(owner, team2.getPlayer(14)!);
          }
        },
      },
    ],

    /// ATTACK OTHER
    attackOther: [
      {
        id: 0,
        weight: 1,
        type: "If 2 players near each other, get some space",
        position_type: "MIDFIELDER",
        preconditions: () => {
          const players = Array.from(match.team1.getPlayers().values());
          for (const player of players) {
            for (const player2 of players) {
              if (player !== player2) {
                const dist = Math.sqrt(
                  Math.pow(
                    player.getPosition().x - player2.getPosition().x,
                    2
                  ) +
                    Math.pow(
                      player.getPosition().y - player2.getPosition().y,
                      2
                    )
                );
                if (dist < 90) {
                  return true;
                }
              }
            }
          }
          return false;
        },
        execute: () => {
          const players = Array.from(match.team1.getPlayers().values());
          for (const player of players) {
            for (const player2 of players) {
              if (player !== player2) {
                const dist = Math.sqrt(
                  Math.pow(
                    player.getPosition().x - player2.getPosition().x,
                    2
                  ) +
                    Math.pow(
                      player.getPosition().y - player2.getPosition().y,
                      2
                    )
                );
                if (dist < 20) {
                  player.goToPosition(
                    initialPostions(
                      player.getTeam().teamName === "team1",
                      player.getData().position
                    )
                  );
                }
              }
            }
          }
        },
      },
      {
        id: 1,
        weight: 10,
        type: "goto Vini Jr",
        player: 20,
        preconditions: () => {
          const viniJr = match.team1.getPlayer(20)!;
          return match.zoneManager.canGoToZone(0, viniJr);
        },
        execute: () => {
          const viniJr = match.team1.getPlayer(20)!;
          viniJr.goToPosition(
            match.zoneManager.getRandomPos(0, viniJr.getOpponentTeam())
          );
        },
      },
      {
        id: 2,
        weight: 10,
        type: "Drop back Vini Jr",
        player: 20,
        preconditions: () => {
          const viniJr = match.team1.getPlayer(20)!;
          return match.zoneManager.canGoToZone(3, viniJr);
        },
        execute: () => {
          const viniJr = match.team1.getPlayer(20)!;
          viniJr.goToPosition(
            match.zoneManager.getRandomPos(3, viniJr.getOpponentTeam())
          );
        },
      },
      {
        id: 2,
        weight: 10,
        type: "goto Benzema",
        player: 9,
        preconditions: () => {
          const benzema = match.team1.getPlayer(9)!;
          return match.zoneManager.canGoToZone(1, benzema);
        },
        execute: () => {
          const benzema = match.team1.getPlayer(9)!;
          benzema.goToPosition(
            match.zoneManager.getRandomPos(1, benzema.getOpponentTeam())
          );
        },
      },
      {
        id: 2,
        weight: 10,
        type: "Drop back Benzema",
        player: 9,
        preconditions: () => {
          const benzema = match.team1.getPlayer(9)!;
          return match.zoneManager.canGoToZone(4, benzema);
        },
        execute: () => {
          const benzema = match.team1.getPlayer(9)!;
          benzema.goToPosition(
            match.zoneManager.getRandomPos(4, benzema.getOpponentTeam())
          );
        },
      },
      {
        id: 3,
        weight: 10,
        type: "defenders go to defensive line",
        position_type: "DEFENDER",
        preconditions: () => {
          return true;
        },
        execute: () => {
          const defenders = match.team1.getPlayersByPosition("DEFENDER");
          defenders!.forEach((defender) => {
            defender.goToDefensiveLine();
          });
        },
      },
      {
        id: 4,
        weight: 10,
        type: "midfielders go to designated positions",
        position_type: "MIDFIELDER",
        preconditions: () => {
          return true;
        },
        execute: () => {
          const midfielders = match.team1.getPlayersByPosition("MIDFIELDER");
          midfielders!.forEach((midfielder) => {
            if (midfielder.getData().position === "CM") {
              midfielder.goToPosition(
                match.zoneManager.getRandomPos(4, midfielder.getOpponentTeam())
              );
            } else if (midfielder.getData().position === "LCM") {
              midfielder.goToPosition(
                match.zoneManager.getRandomPos(3, midfielder.getOpponentTeam())
              );
            } else if (midfielder.getData().position === "RCM") {
              midfielder.goToPosition(
                match.zoneManager.getRandomPos(5, midfielder.getOpponentTeam())
              );
            }
          });
        },
      },
      {
        id: 5,
        weight: 10,
        type: "Valverde go to designated position",
        player: 15,
        preconditions: () => {
          const valverde = match.team1.getPlayer(15)!;
          return match.zoneManager.canGoToZone(2, valverde);
        },
        execute: () => {
          const valverde = match.team1.getPlayer(15)!;
          valverde.goToPosition(
            match.zoneManager.getRandomPos(2, valverde.getOpponentTeam())
          );
        },
      },
      {
        id: 6,
        weight: 5,
        type: "Valverde drop back",
        player: 15,
        preconditions: () => {
          const valverde = match.team1.getPlayer(15)!;
          return match.zoneManager.canGoToZone(5, valverde);
        },
        execute: () => {
          const valverde = match.team1.getPlayer(15)!;
          valverde.goToPosition(
            match.zoneManager.getRandomPos(5, valverde.getOpponentTeam())
          );
        },
      },
    ] as PlanElement[],
  } as Plan;
};

export const team1Plan2 = (match: Match): Plan => {
  return {
    attack: [
      {
        id: 0,
        weight: 1,
        type: "Any",
        preconditions: () => {
          return true;
        },
        execute: () => {
          const ballOwner = match.ball.getOwner();

          if (ballOwner) {
            const players = Array.from(match.team1.getPlayers().values());
            const randomPlayer =
              players[Math.floor(Math.random() * players.length)];

            if (players) {
              ballOwner.passBall(randomPlayer);
            }
          }
        },
      },
      {
        id: 1,
        weight: 10,
        type: "If defender have ball pass to midfielder",
        preconditions: () => {
          const defenders = match.team1.getPlayersByPosition("DEFENDER");
          const ballOwner = match.ball.getOwner();
          if (ballOwner) {
            if (defenders!.includes(ballOwner as FieldPlayer)) {
              const midfielders =
                match.team1.getPlayersByPosition("MIDFIELDER");
              if (midfielders!.length > 0) {
                for (const midfilder of midfielders!) {
                  return midfilder.isPassingLaneClear(ballOwner);
                }
              }
            }
          }
          return false;
        },
        execute: () => {
          const defenders = match.team1.getPlayersByPosition("DEFENDER");
          const ballOwner = match.ball.getOwner();
          if (ballOwner) {
            if (defenders!.includes(ballOwner as FieldPlayer)) {
              const midfielders =
                match.team1.getPlayersByPosition("MIDFIELDER");

              if (midfielders!.length > 0) {
                for (const midfielder of midfielders!) {
                  if (midfielder.isPassingLaneClear(ballOwner)) {
                    ballOwner.passBall(midfielder);
                  }
                }
              }
            }
          }
        },
      },
      {
        id: 2,
        weight: 10,
        type: "If midfielder have ball pass to attacker",
        preconditions: () => {
          const midfielders = match.team1.getPlayersByPosition("MIDFIELDER");
          const ballOwner = match.ball.getOwner();
          if (ballOwner) {
            if (midfielders!.includes(ballOwner as FieldPlayer)) {
              const attackers = match.team1.getPlayersByPosition("STRIKER");
              if (attackers!.length > 0) {
                for (const attacker of attackers!) {
                  return attacker.isPassingLaneClear(ballOwner);
                }
              }
            }
          }
          return false;
        },
        execute: () => {
          const midfielders = match.team1.getPlayersByPosition("MIDFIELDER");
          const ballOwner = match.ball.getOwner();
          if (ballOwner) {
            if (midfielders!.includes(ballOwner as FieldPlayer)) {
              const attackers = match.team1.getPlayersByPosition("STRIKER");
              if (attackers!.length > 0) {
                for (const attacker of attackers!) {
                  if (attacker.isPassingLaneClear(ballOwner)) {
                    ballOwner.passBall(attacker);
                  }
                }
              }
            }
          }
        },
      },
      {
        id: 3,
        weight: 10,
        type: "If attacker have ball pass to midfielder",
        preconditions: () => {
          const attackers = match.team1.getPlayersByPosition("STRIKER");
          const ballOwner = match.ball.getOwner();
          if (ballOwner) {
            if (attackers!.includes(ballOwner as FieldPlayer)) {
              const midfielders =
                match.team1.getPlayersByPosition("MIDFIELDER");
              if (midfielders!.length > 0) {
                for (const midfielder of midfielders!) {
                  return midfielder.isPassingLaneClear(ballOwner);
                }
              }
            }
          }
          return false;
        },
        execute: () => {
          const attackers = match.team1.getPlayersByPosition("STRIKER");
          const ballOwner = match.ball.getOwner();
          if (ballOwner) {
            if (attackers!.includes(ballOwner as FieldPlayer)) {
              const midfielders =
                match.team1.getPlayersByPosition("MIDFIELDER");
              if (midfielders!.length > 0) {
                for (const midfielder of midfielders!) {
                  if (midfielder.isPassingLaneClear(ballOwner)) {
                    ballOwner.passBall(midfielder);
                  }
                }
              }
            }
          }
        },
      },
    ],
    defense: [
      {
        id: 1,
        weight: 10,
        type: "defenders go to defensive line",
        position_type: "DEFENDER",
        preconditions: () => {
          return true;
        },
        execute: () => {
          const defenders = match.team1.getPlayersByPosition("DEFENDER");
          defenders!.forEach((defender) => {
            defender.goToDefensiveLine();
          });
        },
      },
      {
        id: 2,
        weight: 10,
        type: "midfielders cut passing lanes",
        position_type: "MIDFIELDER",
        preconditions: () => {
          return true;
        },
        execute: () => {
          const owner = match.ball.getOwner();
          const team1 = match.team1;
          const team2 = match.team2;
          if (owner) {
            team1.getPlayer(10)?.cutPassingLane(owner, team2.getPlayer(6)!);
            team1.getPlayer(14)?.cutPassingLane(owner, team2.getPlayer(3)!);
            team1.getPlayer(8)?.cutPassingLane(owner, team2.getPlayer(14)!);
          }
        },
      },
    ],
    attackOther: [
      {
        id: 0,
        weight: 1,
        type: "If 2 players near each other, get some space",
        position_type: "MIDFIELDER",
        preconditions: () => {
          const players = Array.from(match.team1.getPlayers().values());
          for (const player of players) {
            for (const player2 of players) {
              if (player !== player2) {
                const dist = Math.sqrt(
                  Math.pow(
                    player.getPosition().x - player2.getPosition().x,
                    2
                  ) +
                    Math.pow(
                      player.getPosition().y - player2.getPosition().y,
                      2
                    )
                );
                if (dist < 90) {
                  return true;
                }
              }
            }
          }
          return false;
        },
        execute: () => {
          const players = Array.from(match.team1.getPlayers().values());
          for (const player of players) {
            for (const player2 of players) {
              if (player !== player2) {
                const dist = Math.sqrt(
                  Math.pow(
                    player.getPosition().x - player2.getPosition().x,
                    2
                  ) +
                    Math.pow(
                      player.getPosition().y - player2.getPosition().y,
                      2
                    )
                );
                if (dist < 20) {
                  player.goToPosition(
                    initialPostions(
                      player.getTeam().teamName === "team1",
                      player.getData().position
                    )
                  );
                }
              }
            }
          }
        },
      },
    ],
  };
};
