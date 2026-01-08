/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  createFixture,
  getFixtureTypes,
  getLeagues,
} from "@/Services/FixtureService";
import { getTeams } from "@/Services/TeamService";
import {
  Card,
  CardContent,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CardActions,
  Button,
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";

export default function CreateFixture(props: any) {
  const [teams, setTeams] = useState([]);
  const [fixtureTypes, setFixtureTypes] = useState([]);
  const [leagues, setLeagues] = useState([]);

  useEffect(() => {
    getTeams().then(setTeams);
    getFixtureTypes().then(setFixtureTypes);
    getLeagues().then(setLeagues);
  }, []);

  const seriesLengths = [
    { id: 1, name: "Best of 1" },
    { id: 3, name: "Best of 3" },
    { id: 5, name: "Best of 5" },
    { id: 7, name: "Best of 7" },
  ];

  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [fixtureType, setFixtureType] = useState("");
  const [league, setLeague] = useState("");
  const [seriesLength, setSeriesLength] = useState(5);
  const [startDateTime, setStartDateTime] = useState(dayjs());

  return (
    <Card
      sx={{
        maxWidth: "100%",
        margin: 2,
        minHeight: 150,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        flexGrow: 1,
      }}
    >
      <CardContent>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "25ch" },
            gap: 2,
          }}
          noValidate
          autoComplete="off"
        >
          <FormControl
            fullWidth
            sx={{ m: 1, minWidth: 150 }}
            variant="standard"
          >
            <InputLabel id="team-1-label">Team 1</InputLabel>
            <Select
              variant="standard"
              labelId="team-1-label"
              id="team-1"
              value={team1}
              label="Team 1"
              onChange={(e) => setTeam1(e.target.value)}
            >
              {teams.map((team: any) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            sx={{ m: 1, minWidth: 150 }}
            variant="standard"
          >
            <InputLabel id="team-2-label">Team 2</InputLabel>
            <Select
              labelId="team-2-label"
              id="team-2"
              value={team2}
              label="Team 2"
              onChange={(e) => setTeam2(e.target.value)}
            >
              {teams.map((team: any) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            sx={{ m: 1, minWidth: 150 }}
            variant="standard"
          >
            <InputLabel id="fixture-type-label">Fixture Type</InputLabel>
            <Select
              labelId="fixture-type-label"
              id="fixture-type"
              value={fixtureType}
              label="Fixture Type"
              onChange={(e) => setFixtureType(e.target.value)}
            >
              {fixtureTypes.map((fType: any) => (
                <MenuItem key={fType.id} value={fType.id}>
                  {fType.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            fullWidth
            sx={{ m: 1, minWidth: 150 }}
            variant="standard"
          >
            <InputLabel id="league-label">League</InputLabel>
            <Select
              labelId="league-label"
              id="league"
              value={league}
              label="League"
              onChange={(e) => setLeague(e.target.value)}
            >
              {leagues.map((league: any) => (
                <MenuItem key={league.id} value={league.id}>
                  {league.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            sx={{ m: 1, minWidth: 150 }}
            variant="standard"
          >
            <InputLabel id="series-length-label">Series Length</InputLabel>
            <Select
              labelId="series-length-label"
              id="series-length"
              value={seriesLength}
              label="Series Length"
              onChange={(e) => setSeriesLength(e.target.value)}
            >
              {seriesLengths.map((seriesLength) => (
                <MenuItem key={seriesLength.id} value={seriesLength.id}>
                  {seriesLength.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ m: 1, minWidth: 150 }}>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="en-gb"
            >
              <DateTimePicker
                label="Start Date Time"
                value={startDateTime}
                onChange={(newValue: any) => setStartDateTime(newValue)}
              />
            </LocalizationProvider>
          </FormControl>
        </Box>
      </CardContent>
      <CardActions>
        <FormControl
          fullWidth
          sx={{
            m: 1,
            minWidth: 150,
            display: "flex",
            flexDirection: "row",
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{ paddingY: 2, minWidth: 100 }}
            onClick={async () => {
              props.onSubmit();
              await createFixture({
                team1Id: team1,
                team2Id: team2,
                fixtureTypeId: fixtureType,
                leagueId: league,
                seriesLength: seriesLength,
                startDateTime: startDateTime,
              });
              setTeam1("");
              setTeam2("");
              setFixtureType("");
              setLeague("");
              setSeriesLength(5);
              setStartDateTime(dayjs());
              props.onCreated();
            }}
          >
            <AddIcon />
          </Button>
        </FormControl>
      </CardActions>
    </Card>
  );
}
