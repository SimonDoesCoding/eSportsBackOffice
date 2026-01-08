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

export default function Teams() {
  const [open, setOpen] = useState(false);
  const [teams, setTeams] = useState<any[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);

  const init = () => {
    handleOpen();
    getTeams().then(setTeams).finally(handleClose);
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
      {teams.map((team: any, i: any) => (
        <TeamCard key={i} team={team} />
      ))}
    </Container>
  );
}
