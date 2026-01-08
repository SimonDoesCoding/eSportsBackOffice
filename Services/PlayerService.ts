/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseUrl } from "./Config";

export const getPlayers = async () => {
  const data = await fetch(`${baseUrl}/players`);
  return (await data.json()).sort((a: any, b: any) =>
    a.name > b.name ? 1 : -1
  );
};

export const updatePlayer = async (player: any) => {
  const data = await fetch(`${baseUrl}/players/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(player),
  });
  return await data.json();
};
