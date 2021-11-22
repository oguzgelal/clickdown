import React, { FC, useState } from "react";
import clsx from "clsx";
import { ListGroup } from "react-bootstrap";
import styled from "styled-components";
import { TTask, TUser } from "../common/types";
import Avatar from "../components/Avatar";

type TaskProps = {
  task: TTask;
};

const AvatarStyled = styled(Avatar)`
  margin-left: -14px;
  &:first-of-type {
    margin-left: 0;
  }
  &:hover {
    z-index: 99999 !important;
  }
`;

const Task: FC<TaskProps> = ({ task }) => {
  const [expanded, expandedSet] = useState(false);

  return (
    <Wrapper
      action
      key={task.id}
      onClick={() => expandedSet(!expanded)}
      expanded={expanded}
      statusColor={task?.status?.color}
      className={clsx("text-truncate", {
        expanded: expanded,
      })}
    >
      <AvatarWrapper>
        {((task?.assignees ?? []).length > 0
          ? (task?.assignees as TUser[])
          : [{ id: 123123, username: "No assignee", initials: "-" } as TUser]
        ).map((user, userIndex) => (
          <AvatarStyled
            key={user.id}
            size={34}
            user={user}
            style={{ zIndex: 9 - userIndex }}
            tooltipPlacement="top"
          />
        ))}
      </AvatarWrapper>
      <TitleWrapper>{task.name}</TitleWrapper>
    </Wrapper>
  );
};

const AvatarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 0;
  min-width: 40px;
  margin-right: 12px;
`;

const TitleWrapper = styled.div`
  align-self: center;
`;

const Wrapper = styled(ListGroup.Item)<{
  expanded: boolean;
  statusColor: string;
}>`
  ${(p) =>
    p.expanded &&
    `
    margin-top: 22px;
    margin-bottom: 22px;

    &:first-of-type {
      margin-top: 0;
    }
    &:last-of-type {
      margin-bottom: 0;
    }

    border-top: 1px solid rgba(0,0,0,.125) !important;
    border-radius: 4px;

    & + button {
      border-top: 1px solid rgba(0,0,0,.125) !important;
    }

    & + button.expanded {
      margin-top: 0 !important;
    }
  `}

  border-left: 4px solid ${(p) => p.statusColor};
  transition: all 0.1s ease-in-out;
  display: flex;
`;

export default Task;
