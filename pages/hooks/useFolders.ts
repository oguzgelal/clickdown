import useSWR from "swr";
import { AUTIFY_SPACE_ENGINEERING } from "../../common/constants";
import { TFolder } from "../../common/types";
import request from "./request";

export const useFoldersKeys = () => ["useFolders"];

const useFolders = () => {
  const { data, error } = useSWR(useFoldersKeys(), (_args: string) => {
    return request(`/space/${AUTIFY_SPACE_ENGINEERING}/folder`);
  });

  return {
    folders: data?.data?.folders as TFolder[],
    foldersLoading: !data?.data?.folders && !error,
    foldersError: error,
  };
};

export default useFolders;
