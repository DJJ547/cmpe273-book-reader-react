import React, { useState, useEffect } from "react";
import {
  Accordion,
  Card,
  Image,
  Icon,
  Input,
  Button,
  Modal,
  Message,
  Menu,
  Grid,
  Dropdown,
  Header,
  Loader,
} from "semantic-ui-react";
import axios from "axios";

import { isColorLight, getBackgroundColor } from "../utils/colorHelpers";
import { iconOptions, colorOptions } from "../utils/utils";

const api_url = process.env.REACT_APP_BACKEND_LOCALHOST;

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
  { key: "recent", text: "Recent", value: "recent" },
  { key: "name", text: "Name", value: "name" },
  { key: "author", text: "Author", value: "author" },
];

const bookMoreOptions = [
  { key: "about", text: "About this book", value: "about" },
  { key: "remove", text: "Remove", value: "remove" },
];

const shelvesMoreOptions = [
  { key: "rename", text: "Rename", value: "rename" },
  { key: "delete", text: "Delete", value: "delete" },
];

const genresBoxes = [
  { key: "fantacy", text: "Fantacy", value: "fantacy" },
  { key: "Horror", text: "Horror", value: "horror" },
];

const Library = () => {
  const itemsPerPage = 9;
  //===================================================States======================================================
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [activeShelvesAccordion, setActiveShelvesAccordion] = useState(true);

  const [historyNumOfBooks, setHistoryNumOfBooks] = useState(0);
  const [wishlistNumOfBooks, setWishlistNumOfBooks] = useState(0);
  const [numOfShelves, setNumOfShelves] = useState(0);

  //Menu
  const [activeMenuItem, setActiveMenuItem] = useState("History");
  const [activeShelf, setActiveShelf] = useState("");

  //Create Shelf Window States
  const [shelfName, setShelfName] = useState("");
  const [shelfIcon, setShelfIcon] = useState("mood");
  const [shelfIconBackgroundColor, setShelfIconBackgroundColor] =
    useState("#FFFFFF");
  const [createShelfWindowIsOpen, setCreateShelfWindowIsOpen] = useState(false);

  const [filterOption, setFilterOption] = useState("recent");
  const [shelvesMoreHoveredId, setShelvesMoreHoveredId] = useState(null);

  const [historyData, setHistoryData] = useState([]);
  const [wishlistData, setWishlistData] = useState([]);
  const [allShelves, setAllShelves] = useState({});
  const [currentBooks, setCurrentBooks] = useState([]);

  //===================================================Event Handlers======================================================
  //Menu
  const handleItemClick = (name) => {
    setActiveMenuItem(name);
    if (name === "History") {
      fetchHistoryData();
      setCurrentBooks(historyData);
    } else if (name === "Wishlist") {
      fetchWishlistData();
      setCurrentBooks(wishlistData);
    } else {
      setCurrentBooks(allShelves[name].books);
    }
  };

  const handleActiveShelvesAccordionClick = () => {
    setActiveShelvesAccordion(!activeShelvesAccordion);
    setActiveMenuItem("Shelves");
  };

  const handleCreateShelfClick = () => {
    setCreateShelfWindowIsOpen(true);
  };

  //Filter Dropdown and Search Field
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleFilterChange = (e, { value }) => setFilterOption(value);

  //Create Shelf Window Handlers
  const handleIconSelect = (icon) => {
    setShelfIcon(icon);
  };

  const handleColorSelect = (color) => {
    setShelfIconBackgroundColor(color);
  };

  const handleCreateShelfConfirmClick = () => {
    const processAddShelf = async () => {
      const result = await addShelf();
      if (result) {
        await fetchShelvesData();
        setCreateShelfWindowIsOpen(false);
        setShelfName("");
        setShelfIcon("");
        setShelfIconBackgroundColor("");
      }
    };
    processAddShelf();
  };

  //===================================================Helper Functions======================================================
  const filterBooks = () => {
    let filteredBooks = currentBooks;
    if (query) {
      filteredBooks = currentBooks.filter((book) => {
        const matchesBookName = book.book_name
          .toLowerCase()
          .includes(query.toLowerCase());
        return matchesBookName;
      });
    }
    if (filterOption === "name") {
      return filteredBooks.sort((a, b) =>
        a.book_name.localeCompare(b.book_name)
      );
    } else if (filterOption === "author") {
      return filteredBooks.sort((a, b) => a.author.localeCompare(b.author));
    } else if (filterOption === "recent") {
      return filteredBooks.sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      );
    } else {
      return filteredBooks;
    }
  };

  const filteredData = filterBooks();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  //===================================================API Requests======================================================
  const fetchShelvesData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api_url}library/get_shelves_data/`, {
        params: { user_id: savedUser.id },
      });
      const shelvesObj = response.data.data;
      console.log("fetched shlves data: ", shelvesObj);
      setAllShelves(shelvesObj);
      setNumOfShelves(Object.values(shelvesObj).length);
    } catch (error) {
      console.error("Error fetching shelves data:", error);
      setError("There was a problem loading your shelves data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlistData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api_url}library/get_wishlist_data/`, {
        params: { user_id: savedUser.id },
      });
      const wishlistArray = response.data.data;
      console.log("fetched wishlist data: ", Object.values(wishlistArray));
      setWishlistData(Object.values(wishlistArray));
      setWishlistNumOfBooks(Object.values(wishlistArray).length);
    } catch (error) {
      console.error("Error fetching wishlist data:", error);
      setError("There was a problem loading your wishlist data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api_url}library/get_history_data/`, {
        params: { user_id: savedUser.id },
      });
      const historyArray = response.data.data;
      console.log("fetched history data: ", Object.values(historyArray));
      setHistoryData(Object.values(historyArray));
      setHistoryNumOfBooks(Object.values(historyArray).length);
      return historyArray;
    } catch (error) {
      console.error("Error fetching history data:", error);
      setError("There was a problem loading your history data.");
    } finally {
      setLoading(false);
    }
  };

  const addShelf = async () => {
    try {
      const response = await axios.post(`${api_url}library/add_shelf/`, {
        user_id: savedUser.id,
        shelf: {
          name: shelfName,
          icon: shelfIcon,
          background_color: shelfIconBackgroundColor,
        },
      });
      const result = response.data.data;
      console.log("add shelf request result: ", result);
      return result;
    } catch (error) {
      console.error("Error adding new shelf:", error);
      setError("There was a problem adding your new shelf.");
    }
  };

  //==================================================Use Effect======================================================
  useEffect(() => {
    const fetchData = async () => {
      await fetchShelvesData();
      await fetchWishlistData();
      const historyDataFetched = await fetchHistoryData();
      setCurrentBooks(historyDataFetched);
    };
    fetchData();
    if (error) {
      const timer = setTimeout(() => {
        setError(""); // Clear the error after 3 seconds (3000 ms)
      }, 10000);

      // Cleanup the timer if the component unmounts or if error changes
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div
      className="wishlist-container"
      style={{ flexGrow: 1, padding: "30px" }}
    >
      <div style={{ display: "flex", padding: "20px", alignItems: "center" }}>
        {error && (
          <Message
            negative
            onDismiss={() => setError("")}
            style={{
              position: "absolute",
              top: "0",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: "1000", // Optional: ensures it appears on top of other elements
              width: "80%", // Adjust as needed for your layout
              maxWidth: "600px", // Optional: constrain the width
            }}
          >
            <Message.Header>Error</Message.Header>
            <p>{error}</p>
          </Message>
        )}
        <h1>My Library</h1>
        <a style={{ marginLeft: "10px" }}>
          <Icon name="clone outline" /> More Books
        </a>
      </div>
      <div style={{ display: "flex", gap: "16px" }}>
        <Menu vertical style={{ width: "250px", fontSize: "16px" }}>
          <Menu.Item
            onClick={() => handleItemClick("History")}
            style={{
              backgroundColor:
                activeMenuItem === "History" ? "#e6f7ff" : "transparent",
              color: activeMenuItem === "History" ? "#1e90ff" : "inherit", // Change text color when active
              borderRadius: activeMenuItem === "History" ? "12px" : "0",
              padding: "15px",
              cursor: "pointer",
              transition: "background-color 0.3s, color 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#f0f4f8")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                activeMenuItem === "History" ? "#e6f7ff" : "transparent")
            }
          >
            <Icon
              name="book"
              style={{
                color: activeMenuItem === "History" ? "#1e90ff" : "inherit",
              }}
            />{" "}
            History
            <span style={{ float: "right" }}>{historyNumOfBooks}</span>
          </Menu.Item>

          <Menu.Item
            onClick={() => handleItemClick("Wishlist")}
            style={{
              backgroundColor:
                activeMenuItem === "Wishlist" ? "#e6f7ff" : "transparent",
              color: activeMenuItem === "Wishlist" ? "#1e90ff" : "inherit", // Change text color when active
              borderRadius: activeMenuItem === "Wishlist" ? "12px" : "0",
              padding: "15px",
              cursor: "pointer",
              transition: "background-color 0.3s, color 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#f0f4f8")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                activeMenuItem === "Wishlist" ? "#e6f7ff" : "transparent")
            }
          >
            <Icon
              name="heart"
              style={{
                color: activeMenuItem === "Wishlist" ? "#1e90ff" : "inherit",
              }}
            />{" "}
            Wishlist
            <span style={{ float: "right" }}>{wishlistNumOfBooks}</span>
          </Menu.Item>
          <Accordion as={Menu.Item}>
            <Accordion.Title
              active={activeShelvesAccordion}
              index={0}
              onClick={handleActiveShelvesAccordionClick}
              style={{
                display: "flex",
                justifyContent: "space-between",
                backgroundColor:
                  activeMenuItem === "Shelves" ? "#e6f7ff" : "transparent",
                color: activeMenuItem === "Shelves" ? "#1e90ff" : "inherit",
                borderRadius: activeMenuItem === "Shelves" ? "12px" : "0",
                cursor: "pointer",
                transition: "background-color 0.3s, color 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f0f4f8")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  activeMenuItem === "Shelves" ? "#e6f7ff" : "transparent")
              }
            >
              <Icon
                name={activeShelvesAccordion?"angle up":"angle down"}
                style={{
                  color: activeMenuItem === "Wishlist" ? "#1e90ff" : "inherit",
                }}
              />
              <span>Shelves</span>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: "8px" }}>{numOfShelves}</span>
                <Icon
                  name="th"
                  style={{
                    color: activeMenuItem === "Shelves" ? "#1e90ff" : "inherit",
                  }}
                />
              </div>
            </Accordion.Title>
            <Accordion.Content active={activeShelvesAccordion}>
              {allShelves && Object.values(allShelves).length > 0 ? (
                Object.values(allShelves).map((shelf, index) => (
                  <Menu.Item
                    onClick={() => handleItemClick(shelf.name)}
                    key={index}
                    style={{
                      backgroundColor:
                        activeMenuItem === shelf.name
                          ? "#e6f7ff"
                          : "transparent",
                      color:
                        activeMenuItem === shelf.name ? "#1e90ff" : "inherit", // Change text color when active
                      borderRadius:
                        activeMenuItem === shelf.name ? "12px" : "0",
                      padding: "10px",
                      cursor: "pointer",
                      transition: "background-color 0.3s, color 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f0f4f8")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        activeMenuItem === shelf.name
                          ? "#e6f7ff"
                          : "transparent")
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 0",
                      }}
                    >
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
                        <span>{shelf.name}</span>{" "}
                        {/* Ensuring text stays aligned */}
                      </div>
                      <span>{shelf.books.length}</span>{" "}
                      {/* Count stays aligned to the right */}
                    </div>
                  </Menu.Item>
                ))
              ) : (
                <></>
              )}
            </Accordion.Content>
          </Accordion>

          <Menu.Item
            onClick={handleCreateShelfClick}
            style={{ color: "#1e90ff" }}
          >
            <Icon name="plus" style={{ color: "#1e90ff" }} /> Create shelf
          </Menu.Item>
        </Menu>

        <div style={{ display: "flex", flexDirection: "column"}}>
          <div style={{ display: "flex", alignItems: "top", marginBottom: "15px" }}>
            <Dropdown
              icon="align left"
              floating
              labeled
              className="icon"
              button
              options={filterOptions}
              value={filterOption}
              onChange={handleFilterChange}
              style={{
                height: "35px",
                width: "130px",
                borderRadius: "12px",
                padding: "10px",
              }}
            />

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
              style={{
                height: "35px",
                width: "250px",
                borderRadius: "12px",
                padding: "0 10px",
              }}
            />
          </div>
          {loading ? (
            <Loader active inline="centered" size="large">
              Loading...
            </Loader>
          ) : (
            <Card.Group itemsPerRow={4} stackable>
              {currentItems && currentItems.length > 0 ? (
                currentItems.map((book, index) => (
                  <Card
                    key={index}
                    style={{
                      width: "250px",
                      height: "450px",
                      margin: "15px",
                    }}
                  >
                    <Card.Content>
                      <Image
                        src={book.book_cover}
                        alt={book.book_name}
                        wrapped
                        ui={false}
                        style={{
                          width: "160px",
                          height: "200px",
                          objectFit: "cover",
                          display: "block",
                          margin: "0 auto",
                        }}
                      />
                    </Card.Content>

                    <Card.Content>
                      <Card.Header>{book.book_name}</Card.Header>
                      <Card.Meta>{book.author}</Card.Meta>
                      {genresBoxes.map((genreBox, index) => (
                        <div
                          key={index}
                          style={{
                            display: "inline-block",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            padding: "4px 8px",
                            margin: "4px",
                            color: "gray",
                            fontSize: "10px",
                          }}
                        >
                          {genreBox.text}
                        </div>
                      ))}
                    </Card.Content>
                    <Card.Content>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          {book.average_rating} <Icon name="star" />
                        </div>
                        <Dropdown
                          icon={<Icon name="ellipsis vertical" />}
                          floating
                          pointing="bottom left"
                          className="icon"
                        >
                          <Dropdown.Menu>
                            {bookMoreOptions.map((option) => (
                              <Dropdown.Item
                                key={option.key}
                                text={option.text}
                              />
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </Card.Content>
                  </Card>
                ))
              ) : (
                <></>
              )}
            </Card.Group>
          )}
        </div>
      </div>
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
        open={createShelfWindowIsOpen}
        onClose={() => setCreateShelfWindowIsOpen(false)}
        size="tiny"
        closeIcon
      >
        <Modal.Header>Enter a name for this shelf</Modal.Header>
        <Modal.Content>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <Header as="h4" style={{ marginRight: "15px" }}>
              Name:
            </Header>
            <Input
              placeholder="Enter shelf name"
              value={shelfName}
              onChange={(e) => setShelfName(e.target.value)}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "20px",
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
              <Header
                as="h4"
                style={{ marginTop: "15px", marginRight: "15px" }}
              >
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
                    {shelfIcon ? (
                      <i
                        className="material-icons"
                        style={{ fontSize: "24px" }}
                      >
                        {shelfIcon}
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
              <Header
                as="h4"
                style={{ marginTop: "15px", marginRight: "15px" }}
              >
                Color:
              </Header>
              <Dropdown
                style={{ width: "90px", marginBottom: "20px" }}
                placeholder="Select Color"
                fluid
                selection
                trigger={
                  <span>
                    {shelfIconBackgroundColor ? (
                      <div
                        style={{
                          backgroundColor: shelfIconBackgroundColor,
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
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setCreateShelfWindowIsOpen(false)}>
            Cancel
          </Button>
          <Button
            primary
            onClick={handleCreateShelfConfirmClick}
            disabled={!shelfName.trim()} // Disable if the input is empty
          >
            Create
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default Library;
