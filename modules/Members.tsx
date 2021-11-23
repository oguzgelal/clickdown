import React, { FC } from "react";
import { Badge } from "react-bootstrap";
import styled from "styled-components";
import { TMember, TUser } from "../common/types";
import Avatar from "../components/Avatar";

type MembersProps = {
  members: TMember[];
  ticketCounts: Record<TUser["id"], number>;
  selectedUser?: TUser["id"];
  selectedUserSet: React.Dispatch<
    React.SetStateAction<TUser["id"] | undefined>
  >;
};

const AvatarWrapper = styled.div`
  margin: auto;
  margin-bottom: 16px;
  position: relative;
`;

const AvatarBadge = styled(Badge).attrs({ pill: true })`
  position: absolute;
  right: -3px;
  bottom: -3px;
  transform: scale(0.8);
  user-select: none;
  pointer-events: none;
`;

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
`;

const Members: FC<MembersProps> = ({
  members,
  ticketCounts,
  selectedUser,
  selectedUserSet,
}) => {
  return (
    <>
      <Wrapper>
        {members
          .sort((a, b) => {
            return (
              (ticketCounts[b.user.id] ?? 0) - (ticketCounts[a.user.id] ?? 0)
            );
          })
          .map((member) => (
            <AvatarWrapper key={member.user.id}>
              <Avatar
                user={member.user}
                active={member.user.id === selectedUser}
                onClick={() => {
                  selectedUserSet(
                    member.user.id === selectedUser ? undefined : member.user.id
                  );
                }}
              />
              <AvatarBadge bg="secondary">
                {ticketCounts[member.user.id] ?? 0}
              </AvatarBadge>
            </AvatarWrapper>
          ))}
      </Wrapper>
    </>
  );
};

export default Members;
