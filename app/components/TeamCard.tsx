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

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function TeamCard(props: any) {
  const [team, setTeam] = useState<any>(props.team);
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <Card key={team.id} sx={{ padding: 2, margin: 2, minWidth: 300 }}>
      <CardHeader title={team.name} subheader={team.id} />
      {!isEditMode && (
        <CardContent>
          <Typography variant="body1" color="text.primary">
            Win Percentages
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textIndent: 10 }}
          >
            Hardpoint: {team.gameModeWinPercents["Hardpoint"]}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textIndent: 10 }}
          >
            SearchAndDestroy: {team.gameModeWinPercents["SearchAndDestroy"]}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textIndent: 10 }}
          >
            Overload: {team.gameModeWinPercents["Overload"]}
          </Typography>
          <Typography variant="body1" color="text.primary">
            Last Roster Change
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textIndent: 10 }}
          >
            {dayjs(team.lastRosterChangeDate).format("DD MMM YYYY")}
          </Typography>
          <Typography variant="body1" color="text.primary">
            Recent Form Modifier
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textIndent: 10 }}
          >
            {team.recentFormModifier}
          </Typography>
        </CardContent>
      )}
      {isEditMode && (
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            value={team.name}
            label="Team Name"
            variant="standard"
            onChange={(e) => {
              setTeam((oldTeam: any) => {
                const newTeam = { ...oldTeam };
                newTeam.name = e.target.value;
                return newTeam;
              });
            }}
          />
          <TextField
            value={team.gameModeWinPercents["Hardpoint"]}
            variant="standard"
            label="Hardpoint Win %"
            onChange={(e: any) => {
              setTeam((oldTeam: any) => {
                const newTeam = { ...oldTeam };
                newTeam.gameModeWinPercents["Hardpoint"] = e.target.value;
                return newTeam;
              });
            }}
          />
          <TextField
            value={team.gameModeWinPercents["SearchAndDestroy"]}
            variant="standard"
            label="SearchAndDestroy Win %"
            onChange={(e: any) => {
              setTeam((oldTeam: any) => {
                const newTeam = { ...oldTeam };
                newTeam.gameModeWinPercents["SearchAndDestroy"] =
                  e.target.value;
                return newTeam;
              });
            }}
          />
          <TextField
            value={team.gameModeWinPercents["Overload"]}
            variant="standard"
            label="Overload Win %"
            onChange={(e: any) => {
              setTeam((oldTeam: any) => {
                const newTeam = { ...oldTeam };
                newTeam.gameModeWinPercents["Overload"] = e.target.value;
                return newTeam;
              });
            }}
          />
          <TextField
            value={team.recentFormModifier}
            variant="standard"
            label="Recent Form Modifier"
            onChange={(e: any) => {
              setTeam((oldTeam: any) => {
                const newTeam = { ...oldTeam };
                newTeam.recentFormModifier = e.target.value;
                return newTeam;
              });
            }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
            <DateTimePicker
              label="Last Roster Change Date"
              value={dayjs(team.lastRosterChangeDate)}
              onChange={(e: any) => {
                setTeam((oldTeam: any) => {
                  const newTeam = { ...oldTeam };
                  newTeam.lastRosterChangeDate = e;
                  return newTeam;
                });
              }}
            />
          </LocalizationProvider>
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
                const updatedTeam = await updateTeam(team);
                setTeam(updatedTeam);
                await simulateTeamFixtures(team.id);
                setIsEditMode(false);
              }}
            >
              Save
            </Button>
            <Button
              aria-label="cancel"
              sx={{ minWidth: 25, minHeight: 25 }}
              variant="outlined"
              onClick={() => {
                setTeam(props.team);
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
