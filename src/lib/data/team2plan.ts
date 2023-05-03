import FieldPlayer from "../fieldplayer";
import Plan from "../interface/plan";
import Match from "../match";
import { initialPostions } from "./initialpositions";

export const team2Plan = (match: Match) => {
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
            const players = Array.from(match.team2.getPlayers().values());
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
          const defenders = match.team2.getPlayersByPosition("DEFENDER");
          const ballOwner = match.ball.getOwner();
          if (ballOwner) {
            if (defenders!.includes(ballOwner as FieldPlayer)) {
              const midfielders =
                match.team2.getPlayersByPosition("MIDFIELDER");
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
          const defenders = match.team2.getPlayersByPosition("DEFENDER");
          const ballOwner = match.ball.getOwner();
          if (ballOwner) {
            if (defenders!.includes(ballOwner as FieldPlayer)) {
              const midfielders =
                match.team2.getPlayersByPosition("MIDFIELDER");

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
          const midfielders = match.team2.getPlayersByPosition("MIDFIELDER");
          const ballOwner = match.ball.getOwner();
          if (ballOwner) {
            if (midfielders!.includes(ballOwner as FieldPlayer)) {
              const attackers = match.team2.getPlayersByPosition("STRIKER");
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
          const midfielders = match.team2.getPlayersByPosition("MIDFIELDER");
          const ballOwner = match.ball.getOwner();
          if (ballOwner) {
            if (midfielders!.includes(ballOwner as FieldPlayer)) {
              const attackers = match.team2.getPlayersByPosition("STRIKER");
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
          const attackers = match.team2.getPlayersByPosition("STRIKER");
          const ballOwner = match.ball.getOwner();
          if (ballOwner) {
            if (attackers!.includes(ballOwner as FieldPlayer)) {
              const midfielders =
                match.team2.getPlayersByPosition("MIDFIELDER");
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
          const attackers = match.team2.getPlayersByPosition("STRIKER");
          const ballOwner = match.ball.getOwner();
          if (ballOwner) {
            if (attackers!.includes(ballOwner as FieldPlayer)) {
              const midfielders =
                match.team2.getPlayersByPosition("MIDFIELDER");
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
          const defenders = match.team2.getPlayersByPosition("DEFENDER");
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
            match.zoneManager.isPositionInZone(0, match.ball.getPosition()) ||
            match.zoneManager.isPositionInZone(1, match.ball.getPosition()) ||
            match.zoneManager.isPositionInZone(2, match.ball.getPosition()) ||
            match.zoneManager.isPositionInZone(3, match.ball.getPosition()) ||
            match.zoneManager.isPositionInZone(4, match.ball.getPosition()) ||
            match.zoneManager.isPositionInZone(5, match.ball.getPosition()) ||
            match.zoneManager.isPositionInZone(6, match.ball.getPosition()) ||
            match.zoneManager.isPositionInZone(7, match.ball.getPosition()) ||
            match.zoneManager.isPositionInZone(8, match.ball.getPosition())
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
            team2.getPlayer(6)?.cutPassingLane(owner, team1.getPlayer(10)!);
            team2.getPlayer(3)?.cutPassingLane(owner, team1.getPlayer(14)!);
            team2.getPlayer(14)?.cutPassingLane(owner, team1.getPlayer(8)!);
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
          const players = Array.from(match.team2.getPlayers().values());
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
          const players = Array.from(match.team2.getPlayers().values());
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
                  console.log("get some space");
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
  } as Plan;
};

export const team2Plan2 = (match: Match) => {
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
            const players = Array.from(match.team2.getPlayers().values());
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
          const defenders = match.team2.getPlayersByPosition("DEFENDER");
          const ballOwner = match.ball.getOwner();
          if (ballOwner) {
            if (defenders!.includes(ballOwner as FieldPlayer)) {
              const midfielders =
                match.team2.getPlayersByPosition("MIDFIELDER");
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
          const defenders = match.team2.getPlayersByPosition("DEFENDER");
          const ballOwner = match.ball.getOwner();
          if (ballOwner) {
            if (defenders!.includes(ballOwner as FieldPlayer)) {
              const midfielders =
                match.team2.getPlayersByPosition("MIDFIELDER");

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
          const midfielders = match.team2.getPlayersByPosition("MIDFIELDER");
          const ballOwner = match.ball.getOwner();
          if (ballOwner) {
            if (midfielders!.includes(ballOwner as FieldPlayer)) {
              const attackers = match.team2.getPlayersByPosition("STRIKER");
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
          const midfielders = match.team2.getPlayersByPosition("MIDFIELDER");
          const ballOwner = match.ball.getOwner();
          if (ballOwner) {
            if (midfielders!.includes(ballOwner as FieldPlayer)) {
              const attackers = match.team2.getPlayersByPosition("STRIKER");
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
          const attackers = match.team2.getPlayersByPosition("STRIKER");
          const ballOwner = match.ball.getOwner();
          if (ballOwner) {
            if (attackers!.includes(ballOwner as FieldPlayer)) {
              const midfielders =
                match.team2.getPlayersByPosition("MIDFIELDER");
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
          const attackers = match.team2.getPlayersByPosition("STRIKER");
          const ballOwner = match.ball.getOwner();
          if (ballOwner) {
            if (attackers!.includes(ballOwner as FieldPlayer)) {
              const midfielders =
                match.team2.getPlayersByPosition("MIDFIELDER");
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
          const defenders = match.team2.getPlayersByPosition("DEFENDER");
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
            match.zoneManager.isPositionInZone(0, match.ball.getPosition()) ||
            match.zoneManager.isPositionInZone(1, match.ball.getPosition()) ||
            match.zoneManager.isPositionInZone(2, match.ball.getPosition()) ||
            match.zoneManager.isPositionInZone(3, match.ball.getPosition()) ||
            match.zoneManager.isPositionInZone(4, match.ball.getPosition()) ||
            match.zoneManager.isPositionInZone(5, match.ball.getPosition()) ||
            match.zoneManager.isPositionInZone(6, match.ball.getPosition()) ||
            match.zoneManager.isPositionInZone(7, match.ball.getPosition()) ||
            match.zoneManager.isPositionInZone(8, match.ball.getPosition())
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
            team2.getPlayer(6)?.cutPassingLane(owner, team1.getPlayer(10)!);
            team2.getPlayer(3)?.cutPassingLane(owner, team1.getPlayer(14)!);
            team2.getPlayer(14)?.cutPassingLane(owner, team1.getPlayer(8)!);
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
          const players = Array.from(match.team2.getPlayers().values());
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
          const players = Array.from(match.team2.getPlayers().values());
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
                  console.log("get some space");
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
  } as Plan;
};
