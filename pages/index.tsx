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

const Wrapper = styled.div`
  display: flex;
`;

const FiltersWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-grow: 1;
  width: 420px;
`;

const ContentsWrapper = styled.div`
  flex-grow: 1;
  width: 100%;
  border-left: 1px solid whitesmoke;
  border-right: 1px solid whitesmoke;
`;

const MembersWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-grow: 1;
  width: 60px;
  height: 100%;
`;

const Home: NextPage = () => {
  const router = useRouter();
  const [token, tokenSet] = useState<string | null>();

  useEffect(() => {
    tokenSet(localStorage.getItem(TOKEN_KEY));
  }, []);

  const { folders, foldersLoading } = useFolders();
  const { lists, listsLoading } = useFolderlessLists();
  const { team, teamLoading } = useTeam();
  const { space, spaceLoading } = useSpace();

  if (foldersLoading || listsLoading || spaceLoading || teamLoading) {
    return <PageLoading />;
  }

  return (
    <Wrapper>
      <FiltersWrapper>
        <Filters space={space} folders={folders} lists={lists} />
      </FiltersWrapper>
      <ContentsWrapper />
      <MembersWrapper>
        <Members team={team} />
      </MembersWrapper>
    </Wrapper>
  );
};

export default Home;
