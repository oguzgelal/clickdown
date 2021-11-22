import React, { FC, useMemo, useState } from "react";
import { Button, Accordion, ListGroup, Stack } from "react-bootstrap";
import styled from "styled-components";
import { TFolder, TList, TSpace, TStatus } from "../common/types";

type FiltersProps = {
  space: TSpace;
  folders: TFolder[];
  lists: TList[];
  selectedList?: TList;
  selectedListStatuses?: TStatus[];
  selectedListSet: React.Dispatch<React.SetStateAction<TList | undefined>>;
  selectedFolder?: TFolder;
  selectedFolderSet: React.Dispatch<React.SetStateAction<TFolder | undefined>>;
  selectedStatus?: TStatus;
  selectedStatusSet: React.Dispatch<React.SetStateAction<TStatus | undefined>>;
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
  .accordion-header {
    button {
      background-color: rgba(0, 0, 0, 0.05);
      color: inherit;
    }
  }
`;

const Filters: FC<FiltersProps> = ({
  space,
  lists,
  folders,
  selectedList,
  selectedListSet,
  selectedFolder,
  selectedFolderSet,
  selectedListStatuses,
  selectedStatus,
  selectedStatusSet,
}) => {
  const [folderFiltered, folderFilteredSet] = useState<
    string | number | undefined
  >();

  const filters = useMemo(() => {
    const statuses = space?.statuses ?? [];

    const useStatuses = (
      selectedListStatuses ??
      selectedFolder?.statuses ??
      statuses
    ).sort((a, b) => a.orderIndex - b.orderIndex);
    const useFolders = folders
      .sort((a, b) => a.orderindex - b.orderindex)
      .filter((folder) => !folder.archived && !folder.hidden);
    const useLists = lists
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
                    selectedStatus?.status === status.status
                      ? undefined
                      : status
                  );
                }}
                active={selectedStatus?.status === status.status}
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
                  onClick={() =>
                    folderFilteredSet(
                      folderFiltered === folder.id ? undefined : folder.id
                    )
                  }
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
                variant={folderFiltered === -1 ? "primary" : "secondary"}
                onClick={() =>
                  folderFilteredSet(folderFiltered === -1 ? undefined : -1)
                }
                size="sm"
              >
                No Folder
              </Button>
            </FilterPillWrapper>

            {/* folderless lists */}
            {(!folderFiltered || folderFiltered === -1) &&
              useLists.map((list) => (
                <ListGroup.Item
                  key={list.id}
                  action
                  active={selectedList?.id === list.id}
                  onClick={() =>
                    selectedListSet(
                      selectedList?.id === list.id ? undefined : list
                    )
                  }
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
                                selectedList?.id === list.id ? undefined : list
                              );
                              selectedFolderSet(
                                selectedList?.id === list.id
                                  ? undefined
                                  : folder
                              );
                            }}
                            active={selectedList?.id === list.id}
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
    selectedFolder,
    selectedFolderSet,
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
