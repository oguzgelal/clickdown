import React, { FC, useMemo, useState } from "react";
import { Button, Accordion, ListGroup, Stack } from "react-bootstrap";
import styled from "styled-components";
import { TFolder, TList, TSpace, TTeam } from "../common/types";

type FiltersProps = {
  space: TSpace;
  folders: TFolder[];
  lists: TList[];
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 22px;
`;

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

const Filters: FC<FiltersProps> = ({ space, lists, folders }) => {
  const [folderFilter, folderFilterSet] = useState<
    string | number | undefined
  >();

  const filters = useMemo(() => {
    const statuses = space?.statuses ?? [];

    const useStatuses = statuses.sort((a, b) => a.orderIndex - b.orderIndex);
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
                  variant={folderFilter === folder.id ? "primary" : "secondary"}
                  size="sm"
                  onClick={() =>
                    folderFilterSet(
                      folderFilter === folder.id ? undefined : folder.id
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
                variant={folderFilter === -1 ? "primary" : "secondary"}
                onClick={() =>
                  folderFilterSet(folderFilter === -1 ? undefined : -1)
                }
                size="sm"
              >
                No Folder
              </Button>
            </FilterPillWrapper>

            {/* folderless lists */}
            {(!folderFilter || folderFilter === -1) &&
              useLists.map((list) => (
                <ListGroup.Item key={list.id}>{list.name}</ListGroup.Item>
              ))}

            {/* folders -> lists */}
            {(!folderFilter || typeof folderFilter === "string") &&
              useFolders
                .map((folder) => {
                  return folderFilter && folderFilter !== folder.id
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
                          <ListGroup.Item key={list.id}>
                            {list.name}
                          </ListGroup.Item>
                        ));
                })
                .flat()}
          </ListGroup>
        ),
      },
    ];
  }, [space, lists, folders, folderFilter, folderFilterSet]);

  return (
    <Wrapper>
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
    </Wrapper>
  );
};

export default Filters;
