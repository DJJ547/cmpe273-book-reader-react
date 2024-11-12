import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
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
import { isColorLight, getIconColor } from "../utils/colorHelpers";

import ReadingListWindowCRUD from "../components/listHistory/ReadingListWindowCRUD";
import ConfirmationWindow from "../components/listHistory/ConfirmationWindow";

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

const savedUser = JSON.parse(localStorage.getItem("user"));

const filterOptions = [
  { key: "name", text: "Name", value: "name" },
  { key: "favorites", text: "Favorites", value: "favorites" },
  { key: "createdTime", text: "Time created", value: "createdTime" },
  { key: "lastUpdatedTime", text: "Last Updated", value: "lastUpdatedTime" },
];

const ReadingLists = () => {
  const navigate = useNavigate();
  const [readingLists, setReadingLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);

  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const [showCrudList, setShowCrudList] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activePopupId, setActivePopupId] = useState(null);
  const [favorites, setFavorites] = useState({});
  const itemsPerPage = 9;

  const [selectedList, setSelectedList] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCardClick = (books, id) => {
    navigate(`readinglist/${id}`, { state: { books } });
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleFavoriteClick = async (id) => {
    const updatedFavorites = new Map(favorites);
    updatedFavorites.set(id, !updatedFavorites.get(id));
    setFavorites(new Map(updatedFavorites));

    setReadingLists((prevLists) =>
      prevLists.map((list) =>
        list.id === id ? { ...list, is_favorite: !list.is_favorite } : list
      )
    );
    console.log(id)
    try {
      await axios.put(`${api_url}listhistory/change_favorite/`, {
        booklist_id: id,
      });
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  const fetchReadingList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${api_url}listhistory/get_reading_list_books/`, {
          params: { user_id: savedUser.id },
      });
      console.log(Object.values(response.data.reading_lists));
      setReadingLists(Object.values(response.data.reading_lists));

      const favoritesMap = new Map(Object.entries(favorites));

      const lists = Object.values(response.data.reading_lists);
      lists.forEach((list) => {
        if (list) {
          favoritesMap.set(list.id, list.is_favorite);
        }
      });
      setFavorites(new Map(favoritesMap));
    } catch (error) {
      console.error("Error fetching reading list:", error);
      setError("There was a problem loading your reading lists.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async (list) => {
    if (!list) return;
    try {
      const response = await axios.delete(
        `${api_url}listhistory/delete_reading_list/`,
        {
          params: { booklist_id: list.id },
        }
      );
      fetchReadingList();
      // Optionally refresh the list or handle the UI state here
    } catch (error) {
      console.error("Error deleting the reading list:", error);
    } finally {
      setShowConfirmation(false); // Close the confirmation window
    }
  };

  const closeReadingListWindowModal = () => {
    setIsEditing(false);
    setShowCrudList(false);
  };

  const handleCreateEditListSubmit = async (isEdit, inputList) => {
    console.log("input list: ", inputList);
    if (!isEdit) {
      try {
        const response = await axios.post(
          `${api_url}listhistory/create_reading_list/`,
          {
            user_id: savedUser.id,
            list: inputList,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Creation successful:", response.data);
        setShowCrudList(false);
        fetchReadingList();
      } catch (error) {
        console.error(
          "Error creating reading list:",
          error.response?.data || error.message
        );
      }
    } else {
      try {
        const response = await axios.put(
          `${api_url}listhistory/edit_reading_list/`,
          {
            user_id: savedUser.id,
            list: inputList,
            reading_list_id: inputList.id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Edit successful:", response.data);
        setShowCrudList(false);
      } catch (error) {
        console.error(
          "Error editing reading list:",
          error.response?.data || error.message
        );
      }
    }
  };

  const closeConfirmationWindowModel = () => {
    setShowConfirmation(false);
    setSelectedList(null);
  };

  const handleAddListClick = () => {
    setIsEditing(false);
    setShowCrudList(true);
  };

  const handleDeleteListClick = (list) => {
    setSelectedList(list); // Set the selected reading list ID
    setShowConfirmation(true); // Open the confirmation window
  };

  const handleEditListClick = (list) => {
    setSelectedList(list);
    setIsEditing(true);
    setShowCrudList(true);
  };

  const handleMoreClick = (id) => {
    setActivePopupId(id);
  };

  useEffect(() => {
    fetchReadingList();
  }, []);

  const handleFilterChange = (e, { value }) => setFilter(value);

  const filterCards = () => {
    let filteredLists = readingLists;
    if (query) {
      filteredLists = readingLists.filter((list) => {
        const matchesListName = list.name
          .toLowerCase()
          .includes(query.toLowerCase());
        return matchesListName;
      });
    }
    if (filter === "name") {
      return filteredLists.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filter === "favorites") {
      return filteredLists.filter((list) => list.is_favorite);
    } else if (filter === "createdTime") {
      return filteredLists.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    } else if (filter === "lastUpdatedTime") {
      return filteredLists.sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      );
    } else {
      return filteredLists;
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
              icon={{
                name: query ? "close" : "search",
                link: true,
                onClick: () => {
                  if (query) setQuery(""); // Clear the input if query is present
                },
              }}
              placeholder="Search..."
              value={query}
              onChange={handleInputChange}
              style={{ width: "70%" }}
            />
          </div>
        </Grid.Column>
        <Grid.Column textAlign="left" width={5}>
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
            onClick={handleAddListClick}
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
            {currentItems.map((item, index) => (
              <Grid.Column key={item.id}>
                <Card
                  style={{
                    width: "20vw",
                    height: "40vh",
                    maxWidth: "300px",
                    maxHeight: "400px",
                    position: "relative",
                    padding: "0px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 16px rgba(0, 0, 0, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 8px rgba(0, 0, 0, 0.1)";
                  }}
                  onClick={() => handleCardClick(item.books, item.id)}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "-15px",
                      right: "-25px",
                      backgroundColor: "transparent",
                      borderRadius: "50%",
                      padding: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1,
                    }}
                  >
                    <Icon
                      onClick={() => handleFavoriteClick(item.id)}
                      name={
                        favorites.get(item.id) ? "bookmark" : "bookmark outline"
                      }
                      size="huge"
                      style={{
                        color: favorites.get(item.id) ? "#FF8C00" : "#A9A9A9",
                        cursor: "pointer",
                        position: "relative", // Set position relative to center the child
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i
                        className="material-icons"
                        style={{
                          position: "absolute",
                          fontWeight: "bold",
                          fontSize: "23px",
                          color: favorites.get(item.id) ? "white" : "#A9A9A9",
                          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                        }}
                      >
                        {!favorites.get(item.id) ? "add" : "remove"}
                      </i>
                    </Icon>
                  </div>
                  <Card.Content style={{ textAlign: "left" }}>
                    <div
                      style={{
                        backgroundColor: item.flag_color,
                        width: "4vw",
                        padding: "1em",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "0.8em",
                      }}
                    >
                      <span
                        className="material-icons"
                        style={{
                          color: getIconColor(item.flag_color),
                          fontSize: "27px",
                          alignItems: "center",
                          padding: "0.5em",
                        }}
                      >
                        {item.icon}
                      </span>
                    </div>
                    <Card.Header>{item.name}</Card.Header>
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
                            <p>{item.description}</p>
                          </div>
                        }
                        open={activePopupId === item.id}
                        onClose={() => setActivePopupId(null)}
                        trigger={
                          <span className="truncated-description">
                            {item.description.slice(0, 50)}
                            {item.description.length > 50 && (
                              <>
                                ...{" "}
                                <span
                                  onClick={() => handleMoreClick(item.id)}
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
                        {formatMysqlTimestamp(item.created_at)} <br />
                        Last Updated At: <br />{" "}
                        {formatMysqlTimestamp(item.updated_at)}
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
                        onClick={() => handleDeleteListClick(item)}
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
                        onClick={() => handleEditListClick(item)}
                        style={{
                          backgroundColor: "#ADD8E6",
                          color: "#00008B",
                        }}
                      >
                        <Icon name="edit" style={{ color: "#00008B" }} />
                        Edit
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
      <Modal
        open={showCrudList}
        onClose={closeReadingListWindowModal}
        size="small"
        centered
      >
        <Modal.Header>
          {isEditing ? "Edit Reading List" : "Create Reading List"}
        </Modal.Header>
        <Modal.Content>
          <ReadingListWindowCRUD
            currentList={selectedList}
            isEdit={isEditing}
            onClose={closeReadingListWindowModal}
            initialName={selectedList?.name || ""}
            initialIcon={selectedList?.icon || null}
            initialColor={selectedList?.flag_color || null}
            initialIsFavorite={selectedList?.is_favorite || false}
            initialDescription={selectedList?.description || ""}
            onSubmit={handleCreateEditListSubmit}
          />
        </Modal.Content>
      </Modal>

      <Modal
        open={showConfirmation}
        onClose={closeConfirmationWindowModel}
        size="small"
        centered
      >
        <Modal.Header>Confirmation</Modal.Header>
        <Modal.Content>
          <ConfirmationWindow
            onConfirm={() => handleDeleteConfirm(selectedList)}
            onClose={closeConfirmationWindowModel}
          />
        </Modal.Content>
      </Modal>
    </Container>
  );
};

export default ReadingLists;
