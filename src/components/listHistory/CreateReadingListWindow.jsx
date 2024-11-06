import React, { useState } from "react";
import {
  Checkbox,
  Container,
  Dropdown,
  Header,
  Form,
  Grid,
} from "semantic-ui-react";

const iconOptions = [
  { key: "contrast", value: "contrast", icon: "contrast", label: "Contrast" },
  { key: "public off", value: "public off", icon: "public off", label: "Public Off" },
  { key: "psychology", value: "psychology", icon: "psychology", label: "Psychology" },
  { key: "comedy mask", value: "comedy mask", icon: "comedy mask", label: "Comedy Mask" },
  {
    key: "science",
    value: "science",
    icon: "science",
    label: "Science",
  },
  { key: "favourite", value: "favourite", icon: "favourite", label: "Favourite" },
  { key: "directions run", value: "directions run", icon: "directions run", label: "Directions Run" },
  { key: "schedule", value: "schedule", icon: "schedule", label: "Schedule" },
  { key: "female", value: "female", icon: "female", label: "Female" },
  { key: "sports martial arts", value: "sports martial arts", icon: "sports martial arts", label: "Sports Martial Arts" },
  { key: "mystery", value: "mystery", icon: "mystery", label: "Mystery" },
  { key: "block", value: "block", icon: "block", label: "Block" },
  { key: "swords", value: "swords", icon: "swords", label: "Swords" },
  { key: "manga", value: "manga", icon: "manga", label: "Manga" },
];

const colorOptions = [
  { key: "red", value: "red", color: "#FF0000", label: "Red" },
  { key: "green", value: "green", color: "#00FF00", label: "Green" },
  { key: "blue", value: "blue", color: "#0000FF", label: "Blue" },
  { key: "yellow", value: "yellow", color: "#FFFF00", label: "Yellow" },
  { key: "purple", value: "purple", color: "#800080", label: "Purple" },
  { key: "orange", value: "orange", color: "#FFA500", label: "Orange" },
  { key: "pink", value: "pink", color: "#FFC0CB", label: "Pink" },
  { key: "teal", value: "teal", color: "#008080", label: "Teal" },
  { key: "brown", value: "brown", color: "#A52A2A", label: "Brown" },
];

const CreateReadingListWindow = () => {
  const [iconSelected, setIconSelected] = useState(null);
  const [colorSelected, setColorSelected] = useState(null);
  const [nameValue, setNameValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const handleChange = (e, { checked }) => {
    setIsFavorite(checked);
  };

  const handleIconSelect = (value) => {
    setIconSelected(value);
  };

  const handleColorSelect = (color) => {
    setColorSelected(color);
  };

  const handleNameChange = (e) => {
    setNameValue(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescriptionValue(e.target.value);
  };

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
            value={nameValue}
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
                  {iconSelected ? (
                    <i className="material-icons" style={{ fontSize: "24px" }}>
                      {iconSelected}
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
                      <span style={{ display: "block", fontSize: "12px" }}>
                        {option.label}
                      </span>
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
                  {colorSelected ? (
                    <div
                      style={{
                        backgroundColor: colorSelected,
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
            checked={isFavorite}
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
              value={descriptionValue}
              onChange={handleDescriptionChange}
            />
          </div>
        </Grid>
      </div>
    </Container>
  );
};

export default CreateReadingListWindow;
