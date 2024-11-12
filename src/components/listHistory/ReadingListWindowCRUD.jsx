import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  Container,
  Dropdown,
  Header,
  Form,
  Grid,
} from "semantic-ui-react";
import { iconOptions, colorOptions } from "../../utils/utils";

const ReadingListWindowCRUD = ({
  currentList,
  isEdit,
  initialName,
  initialIcon,
  initialColor,
  initialIsFavorite,
  initialDescription,
  onSubmit,
  onClose,
}) => {
  const [isEditing, setIsEditing] = useState(isEdit);
  const [inputList, setInputList] = useState({
    id: currentList.id,
    icon: isEdit ? initialIcon : "", 
    color: isEdit ? initialColor : "",
    name: isEdit ? initialName : "",
    description: isEdit ? initialDescription : "",
    isFavorite: isEdit ? initialIsFavorite : false,
  });
  
  // Handle changes for boolean values (e.g., checkboxes)
  const handleChange = (e, { checked }) => {
    setInputList((prevState) => ({
      ...prevState,
      isFavorite: checked,
    }));
  };
  
  // Handle icon selection
  const handleIconSelect = (value) => {
    setInputList((prevState) => ({
      ...prevState,
      icon: value,
    }));
  };
  
  // Handle color selection
  const handleColorSelect = (color) => {
    setInputList((prevState) => ({
      ...prevState,
      color: color,
    }));
  };
  
  // Handle name change
  const handleNameChange = (e) => {
    setInputList((prevState) => ({
      ...prevState,
      name: e.target.value,
    }));
  };
  
  // Handle description change
  const handleDescriptionChange = (e) => {
    setInputList((prevState) => ({
      ...prevState,
      description: e.target.value,
    }));
  };

  const handleFormSubmit = () => {
    console.log(isEditing)
    console.log(currentList)

    onSubmit(isEditing, inputList);
  };

  useEffect(() => {
    setIsEditing(isEdit);
  }, [isEdit]);

  return (
    <Container
      style={{
        width: "60vw",
        height: "60vh",
        marginTop: "2em",
        padding: "50px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "left",
            marginBottom: "20px",
          }}
        >
          <Header as="h4" style={{ marginRight: "15px" }}>
            Name:
          </Header>

          <Form.TextArea
            style={{
              width: "20vw",
              height: "3vh",
              textAlign: "left",
              border: "1px solid black",
              padding: "3px",
            }}
            placeholder="Enter description here"
            value={inputList.name}
            onChange={handleNameChange}
          />
        </div>

        <Grid centered columns={3} padded>
          {/* Icon Selection Dropdown */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "left",
              marginBottom: "20px",
            }}
          >
            <Header as="h4" style={{ marginTop: "15px", marginRight: "15px" }}>
              Icon:
            </Header>
            <Dropdown
              style={{
                width: "90px",
                marginBottom: "20px",
                marginRight: "20px",
              }}
              placeholder="Select Icon"
              fluid
              selection
              trigger={
                <span>
                  {inputList.icon ? (
                    <i className="material-icons" style={{ fontSize: "24px" }}>
                      {inputList.icon}
                    </i>
                  ) : (
                    "Select Icon"
                  )}
                </span>
              }
            >
              <Dropdown.Menu style={{ padding: "10px", width: "200px" }}>
                <Grid columns={3} padded>
                  {iconOptions.map((option) => (
                    <Grid.Column
                      key={option.value}
                      style={{ textAlign: "center", cursor: "pointer" }}
                      onClick={() => handleIconSelect(option.icon)}
                    >
                      <i
                        className="material-icons"
                        style={{ fontSize: "24px" }}
                      >
                        {option.icon}
                      </i>
                    </Grid.Column>
                  ))}
                </Grid>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {/* Color Selection Dropdown */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "left",
              marginBottom: "20px",
            }}
          >
            <Header as="h4" style={{ marginTop: "15px", marginRight: "15px" }}>
              Color:
            </Header>
            <Dropdown
              style={{ width: "90px", marginBottom: "20px" }}
              placeholder="Select Color"
              fluid
              selection
              trigger={
                <span>
                  {inputList.color ? (
                    <div
                      style={{
                        backgroundColor: inputList.color,
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        border: "1px solid #ccc",
                        display: "inline-block",
                      }}
                    />
                  ) : (
                    "Select Color"
                  )}
                </span>
              }
            >
              <Dropdown.Menu style={{ padding: "10px", width: "200px" }}>
                <Grid columns={3} padded>
                  {colorOptions.map((option) => (
                    <Grid.Column
                      key={option.value}
                      style={{ textAlign: "center", cursor: "pointer" }}
                      onClick={() => handleColorSelect(option.color)}
                    >
                      <div
                        style={{
                          backgroundColor: option.color,
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          margin: "0 auto",
                        }}
                      />
                    </Grid.Column>
                  ))}
                </Grid>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <Checkbox
            style={{ marginTop: "15px" }}
            label="Favorite"
            checked={inputList.isFavorite}
            onChange={handleChange}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Header as="h4" style={{ marginBottom: "5px" }}>
              Description:
            </Header>

            <Form.TextArea
              style={{
                width: "30vw",
                height: "30vh",
                marginTop: "5px",
                textAlign: "left",
                padding: "5px",
                border: "1px solid black",
              }}
              placeholder="Enter description here"
              value={inputList.description}
              onChange={handleDescriptionChange}
            />
          </div>
        </Grid>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
          }}
        >
          <Button onClick={onClose}>Cancel</Button>
          <Button
            primary
            onClick={handleFormSubmit}
          >
            {isEditing ? "Save" : "Create"}
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default ReadingListWindowCRUD;
