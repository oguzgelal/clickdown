import React, { FC } from "react";
import { Spinner } from "react-bootstrap";
import PageCenter from "./PageCenter";

type PageLoadingProps = unknown;

const PageLoading: FC<PageLoadingProps> = () => {

  
  return (
    <PageCenter>
      <Spinner animation="border" variant="primary" />
    </PageCenter>
  );
};

export default PageLoading;
