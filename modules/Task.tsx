import React, { FC, useCallback, useMemo, useState } from "react";
import clsx from "clsx";
import urlRegexSafe from "url-regex-safe";
import escapeHTML from "escape-html";
import { Button, ButtonGroup, ButtonToolbar, ListGroup } from "react-bootstrap";
import styled from "styled-components";
import { TStatus, TTask, TUser } from "../common/types";
import Avatar from "../components/Avatar";
import { update } from "../hooks/request";

type TaskProps = {
  task: TTask;
  selectedListStatuses?: TStatus[];
  tasksRevalidate: () => Promise<unknown>;
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

const linkRegexStr = urlRegexSafe({
  returnString: true,
  strict: true,
}) as unknown as string;

const linkRegex = new RegExp(`(${linkRegexStr})`, "gi");

const Task: FC<TaskProps> = ({
  task,
  selectedListStatuses,
  tasksRevalidate,
}) => {
  const [expanded, expandedSet] = useState(false);
  const [updating, updatingSet] = useState(false);

  const combinedHTML = useMemo<string>(() => {
    return task.text_content
      ? escapeHTML(task.text_content).replace(
          linkRegex,
          '<a href="$1" target="_blank" rel="noreferrer noopener">$1</a>'
        )
      : "";
  }, [task]);

  const updateTask = useCallback(
    (status: TStatus["status"]) => {
      if (task) {
        updatingSet(true);
        update(`/task/${task.id}`, { status }).finally(() => {
          tasksRevalidate().then(() => {
            updatingSet(false);
          });
        });
      }
    },
    [task, tasksRevalidate, updatingSet]
  );

  return (
    <Wrapper
      action
      key={task.id}
      onClick={() => expandedSet(!expanded)}
      expanded={expanded}
      updating={updating}
      statusColor={task?.status?.color}
      className={clsx("text-truncate", {
        expanded: expanded,
      })}
    >
      <HeaderWrapper>
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
      </HeaderWrapper>
      {expanded && (
        <DescriptionWrapper>
          <DescriptionText
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <span dangerouslySetInnerHTML={{ __html: combinedHTML }} />
          </DescriptionText>
          <DescriptionFooter>
            <ButtonToolbar aria-label="Toolbar with button groups">
              {/* status change */}
              {selectedListStatuses && (
                <ButtonGroup className="me-2" aria-label="First group">
                  {selectedListStatuses
                    .filter((status) => task?.status?.status !== status.status)
                    .map((status) => (
                      <Button
                        size="sm"
                        key={status.status}
                        style={{
                          backgroundColor: status.color,
                          border: "none",
                          textTransform: "capitalize",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateTask(status.status);
                        }}
                      >
                        {status.status}
                      </Button>
                    ))}
                </ButtonGroup>
              )}

              {/* open in clickup */}
              <ButtonGroup className="me-2" aria-label="Second group">
                <Button
                  as="a"
                  variant="secondary"
                  size="sm"
                  href={task.url}
                  target="_blank"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  Open in ClickUp
                </Button>
              </ButtonGroup>
            </ButtonToolbar>
          </DescriptionFooter>
        </DescriptionWrapper>
      )}
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

const HeaderWrapper = styled.div`
  display: flex;
`;

const DescriptionWrapper = styled.div`
  display: flex;
  flex-flow: column;
  margin-top: 12px;
  user-select: text !important;
  &:hover {
    cursor: initial !important;
  }
`;

const DescriptionText = styled.div`
  display: flex;
  color: var(--bs-gray-700);
  font-size: 14px;
  width: 100%;
  white-space: pre-wrap;
`;

const DescriptionFooter = styled.div`
  margin-top: 12px;
  margin-bottom: 6px;
`;

const Wrapper = styled(ListGroup.Item)<{
  expanded: boolean;
  updating: boolean;
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
  flex-flow: column;

  ${(p) =>
    p.updating &&
    `
    opacity: 0.3;
  `}
`;

export default Task;
