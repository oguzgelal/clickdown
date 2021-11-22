import useSWR from "swr";
import { AUTIFY_SPACE_ENGINEERING } from "../common/constants";
import { TSpace } from "../common/types";
import request from "./request";

export const useSpaceKeys = () => ["useSpace"];

const useSpace = () => {
  const { data, error } = useSWR(useSpaceKeys(), (_args: string) => {
    return request(`/space/${AUTIFY_SPACE_ENGINEERING}`);
  });

  return {
    space: data?.data as TSpace,
    spaceLoading: !data?.data && !error,
    spaceError: error,
  };
};

export default useSpace;
