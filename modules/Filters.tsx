import React, { FC, useEffect, useMemo, useState } from "react";
import { Button, Accordion, ListGroup, Stack } from "react-bootstrap";
import styled from "styled-components";
import {
  SELECTED_FOLDER_FILTER_KEY,
  SELECTED_LIST_KEY,
  SELECTED_STATUS_KEY,
} from "../common/constants";
import { TFolder, TList, TSpace, TStatus } from "../common/types";

type FiltersProps = {
  space: TSpace;
  folders: TFolder[];
  lists: TList[];
  selectedList?: TList["id"];
  selectedListStatuses?: TStatus[];
  selectedListSet: React.Dispatch<
    React.SetStateAction<TList["id"] | undefined>
  >;
  selectedStatus?: TStatus["status"];
  selectedStatusSet: React.Dispatch<
    React.SetStateAction<TStatus["status"] | undefined>
  >;
};

const FilterPillWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 14px 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  margin-top: -6px;

  & > * {
    margin-right: 6px;
    margin-top: 6px;
  }
`;

const AccordionStyled = styled(Accordion)`
  width: 100%;
`;

const Filters: FC<FiltersProps> = ({
  space,
  lists,
  folders,
  selectedList,
  selectedListSet,
  selectedListStatuses,
  selectedStatus,
  selectedStatusSet,
}) => {
  const [folderFiltered, folderFilteredSet] = useState<string | undefined>();

  useEffect(() => {
    const folderFilter = localStorage.getItem(SELECTED_FOLDER_FILTER_KEY);
    if (folderFilter) {
      folderFilteredSet(folderFilter);
    }
  }, []);

  const filters = useMemo(() => {
    const statuses = space?.statuses ?? [];

    const useStatuses = (selectedListStatuses ?? statuses ?? []).sort(
      (a, b) => a.orderIndex - b.orderIndex
    );
    const useFolders = (folders ?? [])
      .sort((a, b) => a.orderindex - b.orderindex)
      .filter((folder) => !folder.archived && !folder.hidden);
    const useLists = (lists ?? [])
      .sort((a, b) => a.orderindex - b.orderindex)
      .filter((list) => !list.archived);

    return [
      {
        id: "status",
        title: "Status",
        bodyStyles: { padding: 0 },
        body: (
          <ListGroup variant="flush">
            {useStatuses.map((status) => (
              <ListGroup.Item
                key={status.id}
                action
                onClick={() => {
                  selectedStatusSet(
                    selectedStatus === status.status ? undefined : status.status
                  );
                  if (selectedStatus === status.status) {
                    localStorage.removeItem(SELECTED_STATUS_KEY);
                  } else {
                    localStorage.setItem(SELECTED_STATUS_KEY, status.status);
                  }
                }}
                active={selectedStatus === status.status}
                style={{
                  borderLeft: `4px solid ${status.color}`,
                  textTransform: "capitalize",
                }}
              >
                {status.status}
              </ListGroup.Item>
            ))}
          </ListGroup>
        ),
      },
      {
        id: "lists",
        title: "Lists",
        bodyStyles: { padding: 0 },
        body: (
          <ListGroup variant="flush">
            <FilterPillWrapper>
              <div style={{ color: "lightgray", fontSize: 12 }}>Filter:</div>
              {useFolders.map((folder) => (
                <Button
                  key={folder.id}
                  variant={
                    folderFiltered === folder.id ? "primary" : "secondary"
                  }
                  size="sm"
                  onClick={() => {
                    folderFilteredSet(
                      folderFiltered === folder.id ? undefined : folder.id
                    );
                    if (folderFiltered === folder.id) {
                      localStorage.removeItem(SELECTED_FOLDER_FILTER_KEY);
                    } else {
                      localStorage.setItem(
                        SELECTED_FOLDER_FILTER_KEY,
                        folder.id
                      );
                    }
                  }}
                  style={{
                    fontSize: 11,
                    borderRadius: 200,
                    padding: "0 6px",
                  }}
                >
                  {folder.name}
                </Button>
              ))}
              <Button
                style={{ fontSize: 11, borderRadius: 200, padding: "0 6px" }}
                variant={folderFiltered === "-1" ? "primary" : "secondary"}
                onClick={() => {
                  folderFilteredSet(folderFiltered === "-1" ? undefined : "-1");
                  if (folderFiltered === "-1") {
                    localStorage.removeItem(SELECTED_FOLDER_FILTER_KEY);
                  } else {
                    localStorage.setItem(SELECTED_FOLDER_FILTER_KEY, "-1");
                  }
                }}
                size="sm"
              >
                No Folder
              </Button>
            </FilterPillWrapper>

            {/* folderless lists */}
            {(!folderFiltered || folderFiltered === "-1") &&
              useLists.map((list) => (
                <ListGroup.Item
                  key={list.id}
                  action
                  active={selectedList === list.id}
                  onClick={() => {
                    selectedListSet(
                      selectedList === list.id ? undefined : list.id
                    );
                    if (selectedList === list.id) {
                      localStorage.removeItem(SELECTED_LIST_KEY);
                    } else {
                      localStorage.setItem(SELECTED_LIST_KEY, list.id);
                    }
                  }}
                >
                  {list.name}
                </ListGroup.Item>
              ))}

            {/* folders -> lists */}
            {(!folderFiltered || typeof folderFiltered === "string") &&
              useFolders
                .map((folder) => {
                  return folderFiltered && folderFiltered !== folder.id
                    ? []
                    : folder.lists
                        .sort((a, b) => {
                          try {
                            return (
                              // @ts-ignore
                              parseInt(b.start_date) - parseInt(a.start_date)
                            );
                          } catch (e) {
                            return 1;
                          }
                        })
                        .map((list) => (
                          <ListGroup.Item
                            key={list.id}
                            action
                            onClick={() => {
                              selectedListSet(
                                selectedList === list.id ? undefined : list.id
                              );
                              if (selectedList === list.id) {
                                localStorage.removeItem(SELECTED_LIST_KEY);
                              } else {
                                localStorage.setItem(
                                  SELECTED_LIST_KEY,
                                  list.id
                                );
                              }
                            }}
                            active={selectedList === list.id}
                          >
                            {list.name}
                          </ListGroup.Item>
                        ));
                })
                .flat()}
          </ListGroup>
        ),
      },
    ];
  }, [
    space,
    lists,
    folders,
    folderFiltered,
    folderFilteredSet,
    selectedList,
    selectedListSet,
    selectedListStatuses,
    selectedStatus,
    selectedStatusSet,
  ]);

  return (
    <>
      <Stack gap={4}>
        {filters.map((filter) => (
          <AccordionStyled key={filter.id} defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>{filter.title}</Accordion.Header>
              <Accordion.Body style={filter.bodyStyles}>
                {filter.body}
              </Accordion.Body>
            </Accordion.Item>
          </AccordionStyled>
        ))}
      </Stack>
    </>
  );
};

export default Filters;
