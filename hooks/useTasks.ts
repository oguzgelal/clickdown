import useSWR from "swr";
import { AUTIFY_TEAM_ID } from "../common/constants";
import { TList, TStatus, TTask, TUser } from "../common/types";
import request from "./request";

type TParams = {
  list_id?: TList["id"];
  status?: TStatus["status"];
  user_id?: TUser["id"];
  page?: number;
};

export const useTasksKeys = ({
  list_id,
  status,
  user_id,
  page = 0,
}: TParams) => [list_id, status, user_id, page, "useTasks"];

const useTasks = (args: TParams) => {
  const { data, error, mutate } = useSWR(
    useTasksKeys(args),
    (listId, statusId, userId, page) => {
      const queryString = new URLSearchParams();
      queryString.append("page", page ?? 0);
      queryString.append("archived", "false");
      if (statusId) queryString.append("statuses[]", statusId);
      if (userId) queryString.append("assignees[]", userId);
      if (!listId) {
        return request(
          `/team/${AUTIFY_TEAM_ID}/task?${queryString.toString()}`
        );
      } else {
        return request(`/list/${listId}/task?${queryString.toString()}`);
      }
    }
  );

  return {
    tasks: data?.data?.tasks as TTask[],
    tasksLoading: !data?.data && !error,
    tasksError: error,
    tasksRevalidate: mutate,
  };
};

export default useTasks;
