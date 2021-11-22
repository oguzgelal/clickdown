import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import PageLoading from "./components/PageLoading";
import { useRouter } from "next/dist/client/router";
import { TOKEN_KEY } from "./common/constants";
import useFolders from "./hooks/useFolders";
import useFolderlessLists from "./hooks/useFolderlessLists";
import useTeam from "./hooks/useTeam";
import styled from "styled-components";
import Filters from "./modules/Filters";
import useSpace from "./hooks/useSpace";
import Members from "./modules/Members";
import { TFolder, TList, TMember, TStatus } from "./common/types";
import request from "./hooks/request";
import useTasks from "./hooks/useTasks";
import { ListGroup, Spinner } from "react-bootstrap";
import Task from "./modules/Task";

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
  const [token, tokenSet] = useState<string | null>();
  const [selectedListStatuses, selectedListStatusesSet] = useState<TStatus[]>();
  const [selectedListMembers, selectedListMembersSet] = useState<TMember[]>();
  const [selectedList, selectedListSet] = useState<TList>();
  const [selectedFolder, selectedFolderSet] = useState<TFolder>();
  const [selectedStatus, selectedStatusSet] = useState<TStatus>();

  useEffect(() => {
    tokenSet(localStorage.getItem(TOKEN_KEY));
  }, []);

  const { folders, foldersLoading } = useFolders();
  const { lists, listsLoading } = useFolderlessLists();
  const { team, teamLoading } = useTeam();
  const { space, spaceLoading } = useSpace();
  const { tasks, tasksLoading } = useTasks({
    list_id: selectedList?.id,
    status: selectedStatus?.status,
    page: 0,
  });

  // fetch selected list data
  useEffect(() => {
    if (selectedList) {
      request(`/list/${selectedList.id}`).then((res) => {
        const list = res.data as TList;
        selectedListStatusesSet(list?.statuses ?? undefined);
      });
      request(`/list/${selectedList.id}/member`).then((res) => {
        const members = res.data.members as TMember[];
        selectedListMembersSet(members);
      });
    } else {
      selectedListStatusesSet(undefined);
    }
  }, [selectedList, selectedListStatusesSet]);

  console.log("tasks", tasks);

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
        {tasksLoading && <Spinner animation="border" variant="primary" />}

        {!tasksLoading && (
          <ListGroup>
            {tasks.map((task) => (
              <Task key={task.id} task={task} />
            ))}
          </ListGroup>
        )}
      </ContentsWrapper>
      <MembersWrapper>
        <Members team={team} />
      </MembersWrapper>
    </Wrapper>
  );
};

export default Home;
