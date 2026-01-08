/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseUrl } from "./Config";

export const getTeams = async () => {
  const data = await fetch(`${baseUrl}/teams`);
  return (await data.json()).sort((a: any, b: any) =>
    a.name > b.name ? 1 : -1
  );
};

export const updateTeam = async (team: any) => {
  const data = await fetch(`${baseUrl}/teams/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(team),
  });
  return await data.json();
};
