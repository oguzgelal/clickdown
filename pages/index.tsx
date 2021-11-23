import React, { useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";
import { ListGroup, Spinner } from "react-bootstrap";
import PageLoading from "../components/PageLoading";
import { useRouter } from "next/dist/client/router";
import { TOKEN_KEY } from "../common/constants";
import { TFolder, TList, TStatus, TUser } from "../common/types";
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
`;

const FiltersWrapper = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
  width: 420px;
  padding: 22px;
  padding-right: 0;
`;

const ContentsWrapper = styled.div`
  min-width: 0;
  flex-grow: 1;
  width: 100%;
  border-right: 1px solid rgba(0, 0, 0, 0.125);
  padding: 22px;
`;

const MembersWrapper = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
  width: 70px;
  padding: 22px 0;
`;

const Home: NextPage = () => {
  const router = useRouter();
  const [selectedListStatuses, selectedListStatusesSet] = useState<TStatus[]>();
  const [selectedList, selectedListSet] = useState<TList>();
  const [selectedFolder, selectedFolderSet] = useState<TFolder>();
  const [selectedStatus, selectedStatusSet] = useState<TStatus>();
  const [selectedUser, selectedUserSet] = useState<TUser["id"]>();
  const [userTicketCounts, userTicketCountsSet] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    if (!t) router.replace("/login");
  }, [router]);

  const { folders, foldersLoading } = useFolders();
  const { lists, listsLoading } = useFolderlessLists();
  const { team, teamLoading } = useTeam();
  const { space, spaceLoading } = useSpace();
  const { tasks, tasksLoading, tasksRevalidate } = useTasks({
    list_id: selectedList?.id,
    status: selectedStatus?.status,
    user_id: selectedUser,
    page: 0,
  });

  // fetch selected list data
  useEffect(() => {
    if (selectedList) {
      request(`/list/${selectedList.id}`).then((res) => {
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
          selectedFolder={selectedFolder}
          selectedFolderSet={selectedFolderSet}
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
        {!tasksLoading && tasks && tasks.length > 0 && (
          <ListGroup>
            {(tasks ?? []).map((task) => (
              <Task
                key={task.id}
                task={task}
                selectedListStatuses={selectedListStatuses}
                tasksRevalidate={tasksRevalidate}
              />
            ))}
          </ListGroup>
        )}
        {!tasksLoading && (!tasks || tasks.length === 0) && (
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
