import React, { useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";
import { ListGroup, Spinner } from "react-bootstrap";
import PageLoading from "../components/PageLoading";
import { useRouter } from "next/dist/client/router";
import {
  MOBILE_BREAKPOINT,
  SELECTED_LIST_KEY,
  SELECTED_STATUS_KEY,
  SELECTED_USER_KEY,
  TOKEN_KEY,
} from "../common/constants";
import { TList, TStatus, TUser } from "../common/types";
import useFolders from "../hooks/useFolders";
import useFolderlessLists from "../hooks/useFolderlessLists";
import useTeam from "../hooks/useTeam";
import styled from "styled-components";
import Filters from "../modules/Filters";
import useSpace from "../hooks/useSpace";
import Members from "../modules/Members";
import request from "../hooks/request";
import useTasks from "../hooks/useTasks";
import Task from "../modules/Task";

const Wrapper = styled.div`
  display: flex;
  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    flex-flow: column;
  }
`;

const FiltersWrapper = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
  width: 420px;
  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    width: 100%;
  }
  padding: 22px;
  padding-right: 0;
  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    padding-right: 22px;
  }
`;

const ContentsWrapper = styled.div`
  min-width: 0;
  flex-grow: 1;
  width: 100%;
  border-right: 1px solid rgba(0, 0, 0, 0.125);
  padding: 22px;
  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    order: 9;
  }
`;

const MembersWrapper = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
  width: 70px;
  padding: 22px 0;
  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    padding: 22px;
    width: 100%;
    & > div {
      flex-flow: row;
      flex-wrap: wrap;
      & > div {
        margin: 8px;
      }
    }
  }
`;

const Home: NextPage = () => {
  const router = useRouter();
  const [selectedListStatuses, selectedListStatusesSet] = useState<TStatus[]>();
  const [selectedList, selectedListSet] = useState<TList["id"]>();
  const [selectedStatus, selectedStatusSet] = useState<TStatus["status"]>();
  const [selectedUser, selectedUserSet] = useState<TUser["id"]>();
  const [userTicketCounts, userTicketCountsSet] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    const list = localStorage.getItem(SELECTED_LIST_KEY);
    const user = localStorage.getItem(SELECTED_USER_KEY);
    const status = localStorage.getItem(SELECTED_STATUS_KEY);
    if (list) selectedListSet(list);
    if (user) selectedUserSet(parseInt(user));
    if (status) selectedStatusSet(status);
    if (!t) router.replace("/login");
  }, [router]);

  const { folders, foldersLoading } = useFolders();
  const { lists, listsLoading } = useFolderlessLists();
  const { team, teamLoading } = useTeam();
  const { space, spaceLoading } = useSpace();
  const { tasks, tasksLoading, tasksRevalidate } = useTasks({
    list_id: selectedList,
    status: selectedStatus,
    user_id: selectedUser,
    page: 0,
  });

  // fetch selected list data
  useEffect(() => {
    if (selectedList) {
      request(`/list/${selectedList}`).then((res) => {
        const list = res.data as TList;
        selectedListStatusesSet(list?.statuses ?? undefined);
      });
    } else {
      selectedListStatusesSet(undefined);
    }
  }, [selectedList, selectedListStatusesSet]);

  // get assignee ticket counts
  useEffect(() => {
    if (Array.isArray(tasks)) {
      const ticketCounts = tasks.reduce<Record<string, number>>((acc, task) => {
        const counts = { ...acc };
        (task?.assignees ?? []).forEach((assignee) => {
          if (!counts[assignee.id]) counts[assignee.id] = 0;
          counts[assignee.id] += 1;
        });
        return counts;
      }, {});
      userTicketCountsSet(ticketCounts);
    }
  }, [tasks, userTicketCountsSet]);

  // sort tasks by status order
  const tasksOrdered = useMemo(() => {
    if (!tasks) return [];
    return tasks.sort((a, b) => {
      return (b.status?.orderindex ?? 0) - (a.status?.orderindex ?? 0);
    });
  }, [tasks]);

  if (foldersLoading || listsLoading || spaceLoading || teamLoading) {
    return <PageLoading />;
  }

  return (
    <Wrapper>
      <FiltersWrapper>
        <Filters
          space={space}
          folders={folders}
          lists={lists}
          selectedList={selectedList}
          selectedListSet={selectedListSet}
          selectedListStatuses={selectedListStatuses}
          selectedStatus={selectedStatus}
          selectedStatusSet={selectedStatusSet}
        />
      </FiltersWrapper>
      <ContentsWrapper>
        {tasksLoading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "calc(100vh - 44px)",
            }}
          >
            <Spinner animation="border" variant="primary" />
          </div>
        )}
        {!tasksLoading && tasksOrdered && tasksOrdered.length > 0 && (
          <ListGroup>
            {(tasksOrdered ?? []).map((task) => (
              <Task
                key={task.id}
                task={task}
                selectedListStatuses={selectedListStatuses}
                tasksRevalidate={tasksRevalidate}
              />
            ))}
          </ListGroup>
        )}
        {!tasksLoading && (!tasksOrdered || tasksOrdered.length === 0) && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "calc(100vh - 44px)",
            }}
          >
            No tasks found
          </div>
        )}
      </ContentsWrapper>
      <MembersWrapper>
        <Members
          members={team?.members ?? []}
          ticketCounts={userTicketCounts}
          selectedUser={selectedUser}
          selectedUserSet={selectedUserSet}
        />
      </MembersWrapper>
    </Wrapper>
  );
};

export default Home;
