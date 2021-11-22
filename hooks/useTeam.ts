import useSWR from "swr";
import { AUTIFY_TEAM_ID } from "../common/constants";
import { TTeam } from "../common/types";
import request from "./request";

export const useTeamKeys = () => ["useTeam"];

const useTeam = () => {
  const { data, error } = useSWR(useTeamKeys(), (_args: string) => {
    return request(`/team/${AUTIFY_TEAM_ID}`);
  });

  return {
    team: data?.data?.team as TTeam,
    teamLoading: !data?.data?.team && !error,
    teamError: error,
  };
};

export default useTeam;
