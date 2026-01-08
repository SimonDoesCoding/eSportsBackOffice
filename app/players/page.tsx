/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { getTeams } from "@/Services/TeamService";
import {
  Backdrop,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import TeamCard from "../components/TeamCard";
import PlayerCard from "../components/PlayerCard";
import { getPlayers } from "@/Services/PlayerService";

export default function Players() {
  const [open, setOpen] = useState(false);
  const [players, setPlayers] = useState<any[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);

  const init = () => {
    handleOpen();
    getPlayers().then(setPlayers).finally(handleClose);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Container
      maxWidth="xl"
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
      {players.map((player: any, i: any) => (
        <PlayerCard key={i} player={player} />
      ))}
    </Container>
  );
}
