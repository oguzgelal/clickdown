import React, { FC, useRef } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import styled from "styled-components";
import { TTeam } from "../common/types";

type MembersProps = {
  team: TTeam;
};

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
`;

const Avatar = styled.div`
  flex-shrink: 0;
  border-radius: 50%;
  border: 2px solid rgba(0, 0, 0, 0.125);
  background-color: rgba(0, 0, 0, 0.03);
  font-size: 13px;
  width: 42px;
  height: 42px;
  margin: auto;
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  overflow: hidden;
  font-weight: bold;
  color: gray;
`;

const AvatarImg = styled.img`
  width: 100%;
`;

const Members: FC<MembersProps> = ({ team }) => {
  const members = team?.members ?? [];
  const target = useRef(null);

  return (
    <>
      <Wrapper>
        {members.map((member) => (
          <OverlayTrigger
            key={member?.user?.id}
            placement="left"
            overlay={<Tooltip>{member.user.username}</Tooltip>}
          >
            <Avatar key={member?.user?.id}>
              {member?.user?.profilePicture && (
                <AvatarImg
                  src={member?.user?.profilePicture}
                  alt={member?.user?.username}
                />
              )}
              {!member?.user?.profilePicture && member?.user?.initials}
            </Avatar>
          </OverlayTrigger>
        ))}
      </Wrapper>
    </>
  );
};

export default Members;
