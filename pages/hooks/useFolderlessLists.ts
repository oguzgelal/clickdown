import useSWR from "swr";
import { AUTIFY_SPACE_ENGINEERING } from "../../common/constants";
import { TList } from "../../common/types";
import request from "./request";

export const useFolderlessListsKeys = () => ["useFolderlessLists"];

const useFolderlessLists = () => {
  const { data, error } = useSWR(useFolderlessListsKeys(), () => {
    return request(`/space/${AUTIFY_SPACE_ENGINEERING}/list`);
  });

  return {
    lists: data?.data?.lists as TList[],
    listsLoading: !data?.data?.lists && !error,
    listsError: error,
  };
};

export default useFolderlessLists;
