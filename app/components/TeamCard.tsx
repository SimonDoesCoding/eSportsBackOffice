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
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { updateTeam } from "@/Services/TeamService";

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
            {team.lastRosterChangeDate}
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
        <CardContent>
          <TextField
            value={team.name}
            onChange={(e) => {
              setTeam((oldTeam: any) => {
                const newTeam = { ...oldTeam };
                newTeam.name = e.target.value;
                return newTeam;
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
              onClick={() => setIsEditMode(false)}
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
            onClick={async () => {
              await updateTeam(team);
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
