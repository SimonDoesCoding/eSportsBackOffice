/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseUrl } from "./Config";

export const getUpcomingFixtures = async () => {
  const data = await fetch(
    `${baseUrl}/fixtures/league/a85df024-6762-4f84-8a14-2fe8e4b72bdd/upcoming`
  );
  return (await data.json()).sort(
    (a: any, b: any) =>
      new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime()
  );
};

export const getUpcomingFixturesByTeam = async (teamId: string) => {
  const fixtures = await getUpcomingFixtures();
  return fixtures.filter(
    (fixture: any) => fixture.team1.id === teamId || fixture.team2.id === teamId
  );
};

export const simulateTeamFixtures = async (teamId: string) => {
  const fixtures = await getUpcomingFixturesByTeam(teamId);
  fixtures.forEach(async (fixture: any) => {
    await simulateFixture(fixture.id);
  });
};

export const deleteFixture = async (fixtureId: string) => {
  fetch(`${baseUrl}/fixtures/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fixtureId),
  });
};

export const getFixtureTypes = async () => {
  const data = await fetch(`${baseUrl}/fixturetypes`);
  return (await data.json()).sort((a: any, b: any) =>
    a.name > b.name ? 1 : -1
  );
};

export const getLeagues = async () => {
  const data = await fetch(`${baseUrl}/leagues`);
  return (await data.json()).sort((a: any, b: any) =>
    a.name > b.name ? 1 : -1
  );
};

export const createFixture = async (fixture: any) => {
  await fetch(`${baseUrl}/fixtures`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      team1Id: fixture.team1Id,
      team2Id: fixture.team2Id,
      fixtureTypeId: fixture.fixtureTypeId,
      leagueId: fixture.leagueId,
      seriesLength: fixture.seriesLength,
      startDateTime: fixture.startDateTime,
    }),
  });
};

export const simulateFixture = async (fixtureId: string) => {
  await fetch(`${baseUrl}/simulation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fixtureId),
  });
};
