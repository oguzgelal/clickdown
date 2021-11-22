import React, { FC } from "react";
import styled from "styled-components";

type PageProps = {
  children: unknown;
};

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  margin: auto;
  width: 520px;
`;

const Page: FC<PageProps> = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};

export default Page;
