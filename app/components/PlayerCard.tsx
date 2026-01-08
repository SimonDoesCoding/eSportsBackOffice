/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  TextField,
  CardActions,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { updateTeam } from "@/Services/TeamService";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { simulateTeamFixtures } from "@/Services/FixtureService";
import "dayjs/locale/de";
import { updatePlayer } from "@/Services/PlayerService";

export default function PlayerCard(props: any) {
  const [player, setPlayer] = useState<any>(props.player);
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <Card key={player.id} sx={{ padding: 2, margin: 2, minWidth: 300 }}>
      <CardHeader title={player.name} subheader={player.id} />
      {!isEditMode && (
        <CardContent>
          <Typography variant="body1" color="text.primary">
            Hardpoint
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textIndent: 10 }}
          >
            Kills Per Map:{player.gameModePlayerStats["Hardpoint"].KillsPerMap}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textIndent: 10 }}
          >
            Deaths Per Map:
            {player.gameModePlayerStats["Hardpoint"].DeathsPerMap}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textIndent: 10 }}
          >
            KD Ratio:{player.gameModePlayerStats["Hardpoint"].KdRatio}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textIndent: 10 }}
          >
            HillTimePer10Mins:
            {player.gameModePlayerStats["Hardpoint"].HillTimePer10Mins}
          </Typography>
          <Typography variant="body1" color="text.primary">
            Search And Destroy
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textIndent: 10 }}
          >
            Kills Per Map:
            {player.gameModePlayerStats["SearchAndDestroy"].KillsPerMap}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textIndent: 10 }}
          >
            Deaths Per Map:
            {player.gameModePlayerStats["SearchAndDestroy"].DeathsPerMap}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textIndent: 10 }}
          >
            KD Ratio:{player.gameModePlayerStats["SearchAndDestroy"].KdRatio}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textIndent: 10 }}
          >
            Plants Per Map:
            {player.gameModePlayerStats["SearchAndDestroy"].PlantsPerMap}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textIndent: 10 }}
          >
            Defuses Per Map:
            {player.gameModePlayerStats["SearchAndDestroy"].DefusesPerMap}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textIndent: 10 }}
          >
            Kills Per Round:
            {player.gameModePlayerStats["SearchAndDestroy"].KillsPerRound}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textIndent: 10 }}
          >
            Deaths Per Round:
            {player.gameModePlayerStats["SearchAndDestroy"].DeathsPerRound}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textIndent: 10 }}
          >
            Opening Duels Won:
            {player.gameModePlayerStats["SearchAndDestroy"].OpeningDuelsWon}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textIndent: 10 }}
          >
            Opening Duels Lost:
            {player.gameModePlayerStats["SearchAndDestroy"].OpeningDuelsLost}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textIndent: 10 }}
          >
            Opening Duel Win Percent:
            {
              player.gameModePlayerStats["SearchAndDestroy"]
                .OpeningDuelWinPercent
            }
          </Typography>
          <Typography variant="body1" color="text.primary">
            Overload
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textIndent: 10 }}
          >
            Kills Per Map:{player.gameModePlayerStats["Overload"].KillsPerMap}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textIndent: 10 }}
          >
            Deaths Per Map:{player.gameModePlayerStats["Overload"].DeathsPerMap}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textIndent: 10 }}
          >
            KD Ratio:{player.gameModePlayerStats["Overload"].KdRatio}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textIndent: 10 }}
          >
            Overloads Per Map:
            {player.gameModePlayerStats["Overload"].OverloadsPerMap}
          </Typography>
        </CardContent>
      )}
      {isEditMode && (
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            value={player.name}
            label="Player Name"
            variant="standard"
            onChange={(e) => {
              setPlayer((oldPlayer: any) => {
                const newPlayer = { ...oldPlayer };
                newPlayer.name = e.target.value;
                return newPlayer;
              });
            }}
          />
          <TextField
            value={player.gameModePlayerStats["Hardpoint"].KillsPerMap}
            variant="standard"
            label="Hardpoint Kills Per Map"
            onChange={(e: any) => {
              setPlayer((oldPlayer: any) => {
                const newPlayer = { ...oldPlayer };
                newPlayer.gameModePlayerStats["Hardpoint"].KillsPerMap =
                  e.target.value;
                return newPlayer;
              });
            }}
          />
          <TextField
            value={player.gameModePlayerStats["Hardpoint"].DeathsPerMap}
            variant="standard"
            label="Hardpoint Deaths Per Map"
            onChange={(e: any) => {
              setPlayer((oldPlayer: any) => {
                const newPlayer = { ...oldPlayer };
                newPlayer.gameModePlayerStats["Hardpoint"].DeathsPerMap =
                  e.target.value;
                return newPlayer;
              });
            }}
          />
          <TextField
            value={player.gameModePlayerStats["Hardpoint"].KdRatio}
            variant="standard"
            label="Hardpoint KD Ratio"
            onChange={(e: any) => {
              setPlayer((oldPlayer: any) => {
                const newPlayer = { ...oldPlayer };
                newPlayer.gameModePlayerStats["Hardpoint"].KdRatio =
                  e.target.value;
                return newPlayer;
              });
            }}
          />
          <TextField
            value={player.gameModePlayerStats["Hardpoint"].HillTimePer10Mins}
            variant="standard"
            label="Hardpoint Hill Time Per 10 Mins"
            onChange={(e: any) => {
              setPlayer((oldPlayer: any) => {
                const newPlayer = { ...oldPlayer };
                newPlayer.gameModePlayerStats["Hardpoint"].HillTimePer10Mins =
                  e.target.value;
                return newPlayer;
              });
            }}
          />
          <TextField
            value={player.gameModePlayerStats["SearchAndDestroy"].KillsPerMap}
            variant="standard"
            label="Search And Destroy Kills Per Map"
            onChange={(e: any) => {
              setPlayer((oldPlayer: any) => {
                const newPlayer = { ...oldPlayer };
                newPlayer.gameModePlayerStats["SearchAndDestroy"].KillsPerMap =
                  e.target.value;
                return newPlayer;
              });
            }}
          />
          <TextField
            value={player.gameModePlayerStats["SearchAndDestroy"].DeathsPerMap}
            variant="standard"
            label="Search And Destroy Deaths Per Map"
            onChange={(e: any) => {
              setPlayer((oldPlayer: any) => {
                const newPlayer = { ...oldPlayer };
                newPlayer.gameModePlayerStats["SearchAndDestroy"].DeathsPerMap =
                  e.target.value;
                return newPlayer;
              });
            }}
          />
          <TextField
            value={player.gameModePlayerStats["SearchAndDestroy"].KdRatio}
            variant="standard"
            label="Search And Destroy KD Ratio"
            onChange={(e: any) => {
              setPlayer((oldPlayer: any) => {
                const newPlayer = { ...oldPlayer };
                newPlayer.gameModePlayerStats["SearchAndDestroy"].KdRatio =
                  e.target.value;
                return newPlayer;
              });
            }}
          />
          <TextField
            value={player.gameModePlayerStats["SearchAndDestroy"].PlantsPerMap}
            variant="standard"
            label="Search And Destroy Plants Per Map"
            onChange={(e: any) => {
              setPlayer((oldPlayer: any) => {
                const newPlayer = { ...oldPlayer };
                newPlayer.gameModePlayerStats["SearchAndDestroy"].PlantsPerMap =
                  e.target.value;
                return newPlayer;
              });
            }}
          />
          <TextField
            value={player.gameModePlayerStats["SearchAndDestroy"].DefusesPerMap}
            variant="standard"
            label="Search And Destroy Defuses Per Map"
            onChange={(e: any) => {
              setPlayer((oldPlayer: any) => {
                const newPlayer = { ...oldPlayer };
                newPlayer.gameModePlayerStats[
                  "SearchAndDestroy"
                ].DefusesPerMap = e.target.value;
                return newPlayer;
              });
            }}
          />
          <TextField
            value={player.gameModePlayerStats["SearchAndDestroy"].KillsPerRound}
            variant="standard"
            label="Search And Destroy Kills Per Round"
            onChange={(e: any) => {
              setPlayer((oldPlayer: any) => {
                const newPlayer = { ...oldPlayer };
                newPlayer.gameModePlayerStats[
                  "SearchAndDestroy"
                ].KillsPerRound = e.target.value;
                return newPlayer;
              });
            }}
          />
          <TextField
            value={
              player.gameModePlayerStats["SearchAndDestroy"].DeathsPerRound
            }
            variant="standard"
            label="Search And Destroy Deaths Per Round"
            onChange={(e: any) => {
              setPlayer((oldPlayer: any) => {
                const newPlayer = { ...oldPlayer };
                newPlayer.gameModePlayerStats[
                  "SearchAndDestroy"
                ].DeathsPerRound = e.target.value;
                return newPlayer;
              });
            }}
          />
          <TextField
            value={
              player.gameModePlayerStats["SearchAndDestroy"].OpeningDuelsWon
            }
            variant="standard"
            label="Search And Destroy Opening Duels Won"
            onChange={(e: any) => {
              setPlayer((oldPlayer: any) => {
                const newPlayer = { ...oldPlayer };
                newPlayer.gameModePlayerStats[
                  "SearchAndDestroy"
                ].OpeningDuelsWon = e.target.value;
                return newPlayer;
              });
            }}
          />
          <TextField
            value={
              player.gameModePlayerStats["SearchAndDestroy"].OpeningDuelsLost
            }
            variant="standard"
            label="Search And Destroy Opening Duels Lost"
            onChange={(e: any) => {
              setPlayer((oldPlayer: any) => {
                const newPlayer = { ...oldPlayer };
                newPlayer.gameModePlayerStats[
                  "SearchAndDestroy"
                ].OpeningDuelsLost = e.target.value;
                return newPlayer;
              });
            }}
          />
          <TextField
            value={
              player.gameModePlayerStats["SearchAndDestroy"]
                .OpeningDuelWinPercent
            }
            variant="standard"
            label="Search And Destroy Opening Duel Win Percent"
            onChange={(e: any) => {
              setPlayer((oldPlayer: any) => {
                const newPlayer = { ...oldPlayer };
                newPlayer.gameModePlayerStats[
                  "SearchAndDestroy"
                ].OpeningDuelWinPercent = e.target.value;
                return newPlayer;
              });
            }}
          />
          <TextField
            value={player.gameModePlayerStats["Overload"].KillsPerMap}
            variant="standard"
            label="Overload Kills Per Map"
            onChange={(e: any) => {
              setPlayer((oldPlayer: any) => {
                const newPlayer = { ...oldPlayer };
                newPlayer.gameModePlayerStats["Overload"].KillsPerMap =
                  e.target.value;
                return newPlayer;
              });
            }}
          />
          <TextField
            value={player.gameModePlayerStats["Overload"].DeathsPerMap}
            variant="standard"
            label="Overload Deaths Per Map"
            onChange={(e: any) => {
              setPlayer((oldPlayer: any) => {
                const newPlayer = { ...oldPlayer };
                newPlayer.gameModePlayerStats["Overload"].DeathsPerMap =
                  e.target.value;
                return newPlayer;
              });
            }}
          />
          <TextField
            value={player.gameModePlayerStats["Overload"].KdRatio}
            variant="standard"
            label="Overload Kd Ratio"
            onChange={(e: any) => {
              setPlayer((oldPlayer: any) => {
                const newPlayer = { ...oldPlayer };
                newPlayer.gameModePlayerStats["Overload"].KdRatio =
                  e.target.value;
                return newPlayer;
              });
            }}
          />
          <TextField
            value={player.gameModePlayerStats["Overload"].OverloadsPerMap}
            variant="standard"
            label="Overload Overloads Per Map"
            onChange={(e: any) => {
              setPlayer((oldPlayer: any) => {
                const newPlayer = { ...oldPlayer };
                newPlayer.gameModePlayerStats["Overload"].OverloadsPerMap =
                  e.target.value;
                return newPlayer;
              });
            }}
          />
        </CardContent>
      )}
      <CardActions>
        {isEditMode && (
          <>
            <Button
              aria-label="save"
              sx={{ minWidth: 25, minHeight: 25 }}
              variant="outlined"
              onClick={async () => {
                const updatedPlayer = await updatePlayer(player);
                setPlayer(updatedPlayer);
                await simulateTeamFixtures(player.id);
                setIsEditMode(false);
              }}
            >
              Save
            </Button>
            <Button
              aria-label="cancel"
              sx={{ minWidth: 25, minHeight: 25 }}
              variant="contained"
              onClick={() => {
                setPlayer(props.player);
                setIsEditMode(false);
              }}
            >
              Cancel
            </Button>
          </>
        )}
        {!isEditMode && (
          <Button
            aria-label="edit"
            sx={{ minWidth: 25, minHeight: 25 }}
            variant="outlined"
            onClick={() => {
              setIsEditMode(true);
            }}
          >
            <EditIcon />
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
