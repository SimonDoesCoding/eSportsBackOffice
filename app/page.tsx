"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Backdrop,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import Link from "next/link";
import {
  deleteFixture,
  getUpcomingFixtures,
  simulateFixture,
} from "@/Services/FixtureService";
import CreateFixture from "./components/CreateFixture";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Home() {
  const [fixtures, setFixtures] = useState([]);
  const [fixturesLoading, setFixturesLoading] = useState(true);
  useEffect(() => {
    getUpcomingFixtures()
      .then(setFixtures)
      .finally(() => setFixturesLoading(false));
  }, []);

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <Backdrop
        sx={(theme) => ({
          color: "#fff",
          zIndex: theme.zIndex.drawer + 1,
        })}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Link href="/teams">Teams</Link>
      <CreateFixture onSubmit={handleOpen} onCreated={handleClose} />
      {fixturesLoading && <CircularProgress />}
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
          <CardActions>
            <Button
              variant="contained"
              onClick={async () => {
                handleOpen();

                await simulateFixture(fixture.id);

                handleClose();
              }}
            >
              Resimulate
            </Button>
            <IconButton
              aria-label="delete"
              onClick={async () => {
                handleOpen();
                await deleteFixture(fixture.id);
                getUpcomingFixtures().then(setFixtures).finally(handleClose);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </Card>
      ))}
    </Container>
  );
}
