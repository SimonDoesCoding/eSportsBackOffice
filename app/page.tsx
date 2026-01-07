"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AppBar,
  Backdrop,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import { get } from "http";

const baseUrl = "https://sitech-esports-services.azurewebsites.net/api";

const getTeams = async () => {
  const data = await fetch(`${baseUrl}/teams`);
  return (await data.json()).sort((a: any, b: any) =>
    a.name > b.name ? 1 : -1
  );
};

const getUpcomingFixtures = async () => {
  const data = await fetch(
    `${baseUrl}/fixtures/league/a85df024-6762-4f84-8a14-2fe8e4b72bdd/upcoming`
  );
  return (await data.json()).sort(
    (a: any, b: any) =>
      new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime()
  );
};

const getFixtureTypes = async () => {
  const data = await fetch(`${baseUrl}/fixturetypes`);
  return (await data.json()).sort((a: any, b: any) =>
    a.name > b.name ? 1 : -1
  );
};

const getLeagues = async () => {
  const data = await fetch(`${baseUrl}/leagues`);
  return (await data.json()).sort((a: any, b: any) =>
    a.name > b.name ? 1 : -1
  );
};

export default function Home() {
  const [fixtures, setFixtures] = useState([]);
  const [teams, setTeams] = useState([]);
  const [fixtureTypes, setFixtureTypes] = useState([]);
  const [leagues, setLeagues] = useState([]);

  useEffect(() => {
    getTeams().then(setTeams);
    getUpcomingFixtures().then(setFixtures);
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

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sitech eSports Back Office
          </Typography>
        </Toolbar>
      </AppBar>
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
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
            <FormControl fullWidth sx={{ m: 1, minWidth: 150 }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ paddingY: 2 }}
                onClick={async () => {
                  handleOpen();
                  await fetch(`${baseUrl}/fixtures`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      team1Id: team1,
                      team2Id: team2,
                      fixtureTypeId: fixtureType,
                      leagueId: league,
                      seriesLength: seriesLength,
                      startDateTime: startDateTime,
                    }),
                  });
                  setTeam1("");
                  setTeam2("");
                  setFixtureType("");
                  setLeague("");
                  setSeriesLength(5);
                  setStartDateTime(dayjs());
                  getUpcomingFixtures().then(setFixtures);
                  handleClose();
                }}
              >
                <AddIcon />
              </Button>
            </FormControl>
          </CardActions>
        </Card>
        {fixtures.map((fixture: any) => (
          <Card
            key={fixture.id}
            sx={{
              maxWidth: "30%",
              margin: 2,
              minHeight: 150,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              flexGrow: 1,
            }}
          >
            <CardHeader
              title={fixture.team1.name + " vs " + fixture.team2.name}
              subheader={fixture.league.name}
            />
            <CardContent>
              <Typography variant="h6" color="text.primary">
                {fixture.fixtureType.name} - Best of {fixture.seriesLength}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {dayjs(fixture.startDateTime).format("DD MMM YYYY HH:mm")}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Container>
    </Box>
  );
}
