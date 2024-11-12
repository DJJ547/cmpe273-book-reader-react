import React from "react";
import { Button, Container } from "semantic-ui-react";

const ConfirmationWindow = ({
  onConfirm,
  onClose,
  message = "Are you sure you want to remove this reading list?",
}) => {
  return (
    <Container
      style={{
        width: "30vw",
        padding: "2em",
        textAlign: "center",
      }}
    >
      <p style={{ marginBottom: "1.5em", fontSize: "1.4em" }}>{message}</p>
      <div style={{ display: "flex", justifyContent: "center", gap: "1em" }}>
        <Button color="red" onClick={onConfirm}>
          Yes
        </Button>
        <Button onClick={onClose}>No</Button>
      </div>
    </Container>
  );
};

export default ConfirmationWindow;
