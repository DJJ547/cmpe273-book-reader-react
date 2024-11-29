import {
  Modal,
  Button as SemanticButton,
  Form,
  Dropdown,
  Input,
  Label,
} from "semantic-ui-react";
import { getBackgroundColor } from "../../utils/colorHelpers";
import { iconOptions, colorOptions } from "../../utils/utils";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export const RemoveShelfModal = ({
  isOpen,
  id,
  onClose,
  data,
  fetchAddedToLibrary,
}) => {
  const { user } = useAuth();
  const removeBookFromShelf = async (shelf_id_input) => {
    try {
      const response = await axios.delete(`/library/remove_book_from_shelf/`, {
        params: {
          user_id: user.id,
          shelf_id: shelf_id_input,
          book_id: id,
        },
      });
      if (response.data.result) {
        fetchAddedToLibrary();
      }
    } catch (error) {
      console.error("Error removing book from shelf:", error);
    }
  };

  const handleDelete = (data) => {
    removeBookFromShelf(data.id);
  };
  return (
    <Modal open={isOpen} onClose={onClose} size="small">
      <Modal.Header>Remove from Shelves</Modal.Header>
      <Modal.Content>
        <Form>
          {data.map((e, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <Input value={e.name} readOnly style={{ marginRight: "10px" }} />
              <SemanticButton
                color="red"
                onClick={() => handleDelete(e)}
                icon="trash"
                content="Delete"
              />
            </div>
          ))}
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <SemanticButton
          primary
          onClick={() => {
            onClose();
          }}
        >
          Done
        </SemanticButton>
      </Modal.Actions>
    </Modal>
  );
};
