import React, { FC } from "react";
import styled from "styled-components";
import { TTeam } from "../common/types";
import Avatar from "../components/Avatar";

type MembersProps = {
  team: TTeam;
};

const AvatarStyled = styled(Avatar)`
  margin: auto;
  margin-bottom: 16px;
`

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
`;

const Members: FC<MembersProps> = ({ team }) => {
  const members = team?.members ?? [];

  return (
    <>
      <Wrapper>
        {members.map((member) => (
          <AvatarStyled key={member.user.id} user={member.user} />
        ))}
      </Wrapper>
    </>
  );
};

export default Members;
