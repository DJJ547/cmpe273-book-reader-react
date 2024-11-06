import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Input,
  Icon,
  Grid,
  Popup,
  Container,
  Header,
  Dropdown,
  Modal,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "./styles.css";

import { formatMysqlTimestamp } from "../utils/timestampConvertors";
import { isColorLight } from "../utils/colorHelper";

import CreateBookListWindow from "../components/listHistory/CreateReadingListWindow";

const api_url = process.env.REACT_APP_BACKEND_LOCALHOST;

// Sample user data
const userData = {
  id: 1,
  name: "Jiajun Dai",
  email: "djj953@gmail.com",
  avatar: undefined,
  token: "12345",
};

if (!localStorage.getItem("user")) {
  localStorage.setItem("user", JSON.stringify(userData));
}

const filterOptions = [
  { key: "name", text: "Name", value: "name" },
  { key: "createdTime", text: "Time created", value: "createdTime" },
  { key: "lastUpdatedTime", text: "Last Updated", value: "lastUpdatedTime" },
];

const ReadingLists = () => {
  const [readingLists, setReadingLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const [showCreateList, setShowCreateList] = useState(false);
  const [activePopupId, setActivePopupId] = useState(null); // Track active popup ID
  const itemsPerPage = 9;

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearchClick = async () => {
    setSearchLoading(true);

    try {
      // Replace with your actual API endpoint
      const response = await axios.get("https://api.example.com/search", {
        params: { q: query },
      });

      // Process the data to fit the `results` format
      const formattedResults = response.data.items.map((item) => ({
        title: item.title,
        description: item.description,
        image: item.image_url, // Optional, if your results have images
      }));

      setResults(formattedResults);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const fetchReadingList = async () => {
    try {
      setLoading(true);
      const savedUser = JSON.parse(localStorage.getItem("user"));
      const response = await axios.get(
        `${api_url}listhistory/get_reading_lists/`,
        {
          params: { user_id: savedUser.id },
        }
      );
      console.log(response.data.reading_lists[0].flag_color);
      setReadingLists(response.data.reading_lists);
    } catch (error) {
      console.error("Error fetching reading list:", error);
      setError("There was a problem loading your reading lists.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddList = () => {
    setShowCreateList(true); // Open the modal
  };

  const closeModal = () => {
    setShowCreateList(false); // Close the modal
  };

  const handleMoreClick = (id) => {
    setActivePopupId(id);
  };

  useEffect(() => {
    fetchReadingList();
  }, []);

  const handleFilterChange = (e, { value }) => setFilter(value);

  const filterCards = () => {
    if (filter === "name") {
      return [...readingLists].sort((a, b) => a.name.localeCompare(b.name));
    } else if (filter === "favorites") {
      return readingLists.filter((list) => list.isFavorite);
    } else if (filter === "createdTime") {
      return readingLists.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    } else if (filter === "lastUpdatedTime") {
      return readingLists.sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      );
    } else {
      return readingLists;
    }
  };

  const filteredData = filterCards();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <Container style={{ marginTop: "2em", textAlign: "left" }}>
      <Header as="h1" textAlign="center">
        Reading Lists
      </Header>
      <Grid
        columns={3}
        verticalAlign="middle"
        centered
        style={{ marginBottom: "2em" }}
      >
        <Grid.Column textAlign="middle" width={5}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Input
              icon="search"
              placeholder="Search..."
              value={query}
              onChange={handleInputChange}
              style={{ width: "80%" }}
            />
            <Button
              onClick={handleSearchClick}
              loading={searchLoading}
              primary
              style={{ marginLeft: "10px" }}
            >
              Search
            </Button>
          </div>
        </Grid.Column>
        <Grid.Column textAlign="middle" width={5}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Header as="h4" style={{ margin: 0 }}>
              Filter by:
            </Header>
            <Dropdown
              placeholder="Select Filter"
              selection
              options={filterOptions}
              onChange={handleFilterChange}
              style={{ width: "50%" }}
            />
          </div>
        </Grid.Column>
        <Grid.Column textAlign="left" width={5}>
          <Button
            onClick={handleAddList}
            style={{
              backgroundColor: "#A9A9A9",
              color: "#696969",
              marginRight: "8px",
            }}
          >
            <Icon name="plus" style={{ color: "#696969" }} />
            Add a List
          </Button>
        </Grid.Column>
      </Grid>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Grid columns={3}>
            {currentItems.map((list, index) => (
              <Grid.Column key={index}>
                <Card
                  style={{
                    width: "20vw",
                    height: "35vh",
                    maxWidth: "300px",
                    maxHeight: "400px",
                    position: "relative",
                    padding: "0px",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "-20px",
                      right: "-25px",
                      backgroundColor: "transparent",
                      color: list.flag_color,
                      borderRadius: "50%",
                      padding: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1,
                    }}
                  >
                    <Icon name="circle" size="huge" />
                    <span
                      style={{
                        position: "absolute",
                        fontWeight: "bold",
                        fontSize: "18px",
                        fontFamily: "'Poppins', sans-serif",
                        color: isColorLight(list.flag_color)
                          ? "black"
                          : "white",
                        zIndex: 2,
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      {list.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <Card.Content style={{ textAlign: "left" }}>
                    <Card.Header>{list.name}</Card.Header>
                    <Card.Meta
                      style={{
                        fontSize: "0.9em",
                        fontWeight: "bold",
                        marginTop: "0.5em",
                      }}
                    >
                      Description:
                    </Card.Meta>
                    <Card.Description
                      style={{
                        fontSize: "0.9em",
                        marginTop: "0.2em",
                      }}
                    >
                      <Popup
                        on="click"
                        content={
                          <div>
                            <span
                              onClick={() => setActivePopupId(null)}
                              style={{
                                position: "absolute",
                                top: "5px",
                                right: "5px",
                                cursor: "pointer",
                                fontWeight: "bold",
                                fontSize: "16px",
                                color: "black",
                              }}
                            >
                              &times;
                            </span>
                            <p>{list.description}</p>
                          </div>
                        }
                        open={activePopupId === list.id}
                        onClose={() => setActivePopupId(null)}
                        trigger={
                          <span className="truncated-description">
                            {list.description.slice(0, 50)}
                            {list.description.length > 50 && (
                              <>
                                ...{" "}
                                <span
                                  onClick={() => handleMoreClick(list.id)}
                                  style={{ color: "blue", cursor: "pointer" }}
                                >
                                  (more)
                                </span>
                              </>
                            )}
                          </span>
                        }
                      />
                    </Card.Description>
                    <Card.Meta>
                      <span className="date">
                        Created At: <br />{" "}
                        {formatMysqlTimestamp(list.created_at)} <br />
                        Last Updated At: <br />{" "}
                        {formatMysqlTimestamp(list.updated_at)}
                      </span>
                    </Card.Meta>
                  </Card.Content>
                  <Card.Content extra style={{ textAlign: "center" }}>
                    <Button.Group
                      widths="2"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Button
                        style={{
                          backgroundColor: "#FFCCCC",
                          color: "#8B0000",
                          marginRight: "8px",
                        }}
                      >
                        <Icon name="trash" style={{ color: "#8B0000" }} />
                        Delete
                      </Button>
                      <Button
                        style={{
                          backgroundColor: "#ADD8E6",
                          color: "#00008B",
                        }}
                      >
                        <Icon name="bookmark" style={{ color: "#00008B" }} />
                        Favorite
                      </Button>
                    </Button.Group>
                  </Card.Content>
                </Card>
              </Grid.Column>
            ))}
          </Grid>
        </>
      )}
      <div style={{ textAlign: "center", marginTop: "2em" }}>
        <Button
          icon="chevron left"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        />
        <span style={{ margin: "0 1em" }}>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          icon="chevron right"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        />
      </div>
      {/* Modal for CreateBookListWindow */}
      <Modal open={showCreateList} onClose={closeModal} size="small" centered>
        <Modal.Header>Create a New Reading List</Modal.Header>
        <Modal.Content>
          <CreateBookListWindow onClose={closeModal} />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button primary onClick={closeModal}>
            Create
          </Button>
        </Modal.Actions>
      </Modal>
    </Container>
  );
};

export default ReadingLists;
