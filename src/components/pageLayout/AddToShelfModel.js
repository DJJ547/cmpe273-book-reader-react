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
const userData = {
  id: 1,
};
if (!localStorage.getItem("user")) {
  localStorage.setItem("user", JSON.stringify(userData));
}
const savedUser = JSON.parse(localStorage.getItem("user"));

export const ShelfModal = ({ isOpen, id, onClose }) => {
  const fetchShelves = async () => {
    try {
      await axios
        .get(`/library/get_library_data/`, {
          params: { user_id: savedUser.id },
        })
        .then((SUCCESS) => {
          console.log("SUCCESS", SUCCESS.data.data);
          setShelves(SUCCESS.data.data.Shelves);
        })
        .catch((e) => {
          console.log("/library/get_library_data/ failed e", e);
        });
    } catch (error) {
      console.error("Error fetching shelves data:", error);
    }
  };
  const [selectedShelf, setSelectedShelf] = useState("");
  const [newShelfName, setNewShelfName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const [shelves, setShelves] = useState([]);

  const addBookToShelf = async () => {
    try {
      let shelfToAdd = {};
      if (newShelfName) {
        const addShelfresponse = await axios.post(`/library/add_shelf/`, {
          user_id: savedUser.id,
          shelf: {
            name: newShelfName,
            icon: selectedIcon,
            background_color: selectedColor,
          },
        });

        if (response.data.result) {
          fetchShelves();
        }
        shelfToAdd = shelves.find((shelf) => shelf.name === newShelfName);
      } else {
        shelfToAdd = shelves.find((shelf) => shelf.name === selectedShelf);
      }

      const response = await axios.post(`/library/add_book_to_shelf/`, {
        user_id: savedUser.id,
        shelf_id: shelfToAdd.id,
        book_id: id,
      });

      if (response.data.result) {
        alert(
          `The book has been saved to ${
            shelfToAdd ? shelfToAdd.name : newShelfName
          }`
        );
        setNewShelfName("");
        setSelectedColor("");
        setSelectedIcon("");
      }
    } catch (error) {
      console.error("Error adding book to shelf:", error);
      alert(error);
    }
  };

  const handleAddToShelf = () => {
    if (selectedShelf || newShelfName) {
      addBookToShelf();
    } else {
      alert(
        "Must choose an existing shelf or fill in info of a new shelf before saving."
      );
    }
  };

  useEffect(() => {
    fetchShelves();
  }, []);
  console.log("shelves", shelves);
  const shelfOptions = shelves.map((shelf) => ({
    key: shelf.name,
    value: shelf.name,
    content: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            width: "24px",
            height: "24px",
            backgroundColor: shelf.background_color,
            borderRadius: "4px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginRight: "10px",
            overflow: "hidden",
          }}
        >
          <span
            className="material-icons"
            style={{
              color: getBackgroundColor(shelf.background_color),
              fontSize: "18px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {shelf.icon}
          </span>
        </div>
        {shelf.name}
      </div>
    ),
  }));

  const selectedOption = shelves.find((shelf) => shelf.name === selectedShelf);
  return (
    <Modal open={isOpen} onClose={onClose} size="small">
      <Modal.Header>Add to Shelf</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <Label ribbon color="green">
              Choose an existing shelf
            </Label>
            <Dropdown
              clearable
              disabled={newShelfName !== ""}
              placeholder="Select a shelf"
              fluid
              selection
              options={shelfOptions}
              value={selectedShelf}
              onChange={(e, { value }) => setSelectedShelf(value)}
              text={
                selectedOption ? (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        backgroundColor: selectedOption.background_color,
                        borderRadius: "4px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: "10px",
                        overflow: "hidden",
                      }}
                    >
                      <span
                        className="material-icons"
                        style={{
                          color: getBackgroundColor(
                            selectedOption.background_color
                          ),
                          fontSize: "18px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {selectedOption.icon}
                      </span>
                    </div>
                    {selectedOption.name}
                  </div>
                ) : (
                  "Select a shelf"
                )
              }
            />
          </Form.Field>
          <Form.Field>
            <Label
              ribbon
              color="green
            "
            >
              Create a New Shelf
            </Label>
            <Input
              disabled={selectedShelf !== ""}
              fluid
              placeholder="Shelf Name"
              value={newShelfName}
              onChange={(e) => setNewShelfName(e.target.value)}
              style={{ marginBottom: "20px" }}
            />

            {/* Icon Dropdown */}
            <Dropdown
              disabled={selectedShelf !== ""}
              placeholder="Select an icon"
              fluid
              selection
              options={iconOptions.map((option) => ({
                key: option.key,
                value: option.value,
                text: (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <i
                      className="material-icons"
                      style={{ fontSize: "20px", marginRight: "10px" }}
                    >
                      {option.icon}
                    </i>
                    {option.label}
                  </div>
                ),
              }))}
              value={selectedIcon}
              onChange={(e, { value }) => setSelectedIcon(value)}
              style={{ marginBottom: "20px" }}
            />

            {/* Color Dropdown */}
            <Dropdown
              disabled={selectedShelf !== ""}
              placeholder="Select a background color"
              fluid
              selection
              options={colorOptions.map((option) => ({
                key: option.key,
                value: option.value,
                text: (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: option.color,
                        borderRadius: "50%",
                        marginRight: "10px",
                      }}
                    ></div>
                    {option.label}
                  </div>
                ),
              }))}
              value={selectedColor}
              onChange={(e, { value }) => setSelectedColor(value)}
              style={{ marginBottom: "20px" }}
            />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <SemanticButton
          onClick={() => {
            onClose();
            setNewShelfName("");
            setSelectedColor("");
            setSelectedIcon("");
            setSelectedShelf("");
          }}
        >
          Cancel
        </SemanticButton>
        <SemanticButton primary onClick={handleAddToShelf}>
          Add to Shelf
        </SemanticButton>
      </Modal.Actions>
    </Modal>
  );
};