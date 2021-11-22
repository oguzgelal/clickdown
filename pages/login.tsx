import React, { useState } from "react";
import type { NextPage } from "next";
import { Button, Form } from "react-bootstrap";
import { useRouter } from "next/dist/client/router";
import PageCenter from "./components/PageCenter";
import { TOKEN_KEY } from "./common/constants";

const Home: NextPage = () => {
  const router = useRouter();
  const [token, tokenSet] = useState("");

  return (
    <PageCenter>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (token) {
            localStorage.setItem(TOKEN_KEY, token);
            setTimeout(() => {
              router.replace("/");
            }, 100);
          }
        }}
      >
        <Form.Group className="mb-3">
          <Form.Label>Personal Access Token</Form.Label>
          <Form.Control
            type="text"
            placeholder="pk_"
            onChange={(e) => tokenSet(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Sign In
        </Button>
      </Form>
    </PageCenter>
  );
};

export default Home;
