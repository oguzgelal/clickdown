import React, { FC } from "react";
import styled from "styled-components";

type PageCenterProps = {
  children: unknown;
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const PageCenter: FC<PageCenterProps> = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};

export default PageCenter;
