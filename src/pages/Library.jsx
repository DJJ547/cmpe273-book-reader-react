import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

import { getBackgroundColor } from "../utils/colorHelpers";
import { iconOptions, colorOptions } from "../utils/utils";
import "semantic-ui-css/semantic.min.css";

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

const HistoryWishlistBookMoreOptions = [
  { key: "about", text: "About this book", value: "about" },
  { key: "remove", text: "Remove", value: "remove" },
];

const ShelvesBookMoreOptions = [
  { key: "about", text: "About this book", value: "about" },
  { key: "move", text: "Move", value: "move" },
  { key: "remove", text: "Remove", value: "remove" },
];

const shelvesMoreOptions = [
  { key: "edit", text: "Edit", value: "edit" },
  { key: "remove", text: "Remove", value: "remove" },
];

const Library = () => {
  const navigate = useNavigate();
  const itemsPerPage = 9;
  //===================================================States======================================================
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreating, setIsCreating] = useState(true);

  const [activeShelvesAccordion, setActiveShelvesAccordion] = useState(true);

  //Library Data
  const [allShelvesWithBooks, setAllShelvesWithBooks] = useState([]);
  const [numOfShelves, setNumOfShelves] = useState(0);
  const [allHistoryBooks, setAllHistoryBooks] = useState([]);
  const [numOfHistoryBooks, setNumOfHistoryBooks] = useState(0);
  const [allWishlistBooks, setAllWishlistBooks] = useState([]);
  const [numOfWishlistBooks, setnumOfWishlistBooks] = useState(0);

  //Menu
  const [activeMenuItem, setActiveMenuItem] = useState({});
  const [shelvesNumOfBooks, setShelvesNumOfBooks] = useState({});

  //Create Shelf Window States
  const [shelfName, setShelfName] = useState("");
  const [shelfIcon, setShelfIcon] = useState("mood");
  const [shelfIconBackgroundColor, setShelfIconBackgroundColor] =
    useState("#FFFFFF");
  const [createEditShelfWindowIsOpen, setCreateEditShelfWindowIsOpen] =
    useState(false);

  const [filterOption, setFilterOption] = useState("recent");
  const [shelvesMoreHoveredId, setShelvesMoreHoveredId] = useState(null);

  const [currentBooks, setCurrentBooks] = useState([]);
  const [currentShelfSelected, setCurrentShelfSelected] = useState({});

  //===================================================Event Handlers======================================================
  //Menu
  const handleItemClick = (currentItem, itemName) => {
    setActiveMenuItem(currentItem);
    if (itemName === "History") {
      setCurrentBooks(allHistoryBooks);
    } else if (itemName === "Wishlist") {
      setCurrentBooks(allWishlistBooks);
    } else {
      setCurrentBooks(currentItem[itemName].books);
    }
  };

  const handleActiveShelvesAccordionClick = () => {
    setActiveShelvesAccordion(!activeShelvesAccordion);
  };

  const handleCreateEditShelfClick = (command) => {
    if (command === "create") {
      setIsCreating(true);
    } else if (command === "edit") {
      setIsCreating(false);
      setShelfName(currentShelfSelected.name);
      setShelfIcon(currentShelfSelected.icon);
      setShelfIconBackgroundColor(currentShelfSelected.background_color);
    }
    setCreateEditShelfWindowIsOpen(true);
  };

  //Filter Dropdown and Search Field
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleFilterChange = (e, { value }) => setFilterOption(value);

  //Create Shelf Window
  const handleIconSelect = (icon) => {
    setShelfIcon(icon);
  };

  const handleColorSelect = (color) => {
    setShelfIconBackgroundColor(color);
  };

  const handleCreateEditShelfConfirmClick = async () => {
    if (isCreating) {
      const result = await addShelf();
      if (result) {
        setCreateEditShelfWindowIsOpen(false);
        setShelfName("");
        setShelfIcon("");
        setShelfIconBackgroundColor("");
      }
    } else {
      const result = await editShelf({
        ...currentShelfSelected,
        name: shelfName,
        icon: shelfIcon,
        background_color: shelfIconBackgroundColor,
      });
      if (result) {
        setCreateEditShelfWindowIsOpen(false);
        setShelfName("");
        setShelfIcon("");
        setShelfIconBackgroundColor("");
      }
    }
  };

  //Card More Options Click
  const handleCardMoreOptionsClick = (option, book_id) => {
    if (activeMenuItem.History) {
      if (option === "about") {
        navigate(`/`);
      } else if (option === "remove") {
        removeBookFromHistory(book_id);
      }
    } else if (activeMenuItem.Wishlist) {
      if (option === "about") {
        navigate(`/`);
      } else if (option === "remove") {
        removeBookFromWishlist(book_id);
      }
    } else {
      if (option === "about") {
        navigate(`/`);
      } else if (option === "remove") {
        removeBookFromShelf(Object.values(activeMenuItem)[0].id, book_id);
      }
    }
  };

  //Shelves More Options Click
  const handleShelvesMoreOptionsClick = (option) => {
    if (option === "edit") {
      handleCreateEditShelfClick("edit");
    } else if (option === "remove") {
      removeShelf(currentShelfSelected.id);
    }
  };

  //===================================================Helper Functions======================================================
  const filterBooks = () => {
    let filteredBooks = currentBooks;
    if (query) {
      filteredBooks = currentBooks.filter((book) => {
        const matchesBookName = book.book_name
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesAuthorName = book.author
          .toLowerCase()
          .includes(query.toLowerCase());
        return matchesBookName || matchesAuthorName;
      });
    }
    if (filterOption === "name") {
      return filteredBooks.sort((a, b) =>
        a.book_name.localeCompare(b.book_name)
      );
    } else if (filterOption === "author") {
      return filteredBooks.sort((a, b) => a.author.localeCompare(b.author));
    } else if (filterOption === "recent") {
      if (
        filteredBooks &&
        filteredBooks.length > 0 &&
        filteredBooks[0].hasOwnProperty("added_at")
      ) {
        return filteredBooks.sort(
          (a, b) => new Date(b.added_at) - new Date(a.added_at)
        );
      } else {
        return filteredBooks.sort(
          (a, b) => new Date(b.last_read_at) - new Date(a.last_read_at)
        );
      }
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
  const fetchLibraryData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api_url}library/get_library_data/`, {
        params: { user_id: savedUser.id },
      });
      console.log("fetched library data: ", response.data.data);
      //sync shelves data
      const shelvesArray = response.data.data.Shelves;
      setAllShelvesWithBooks(shelvesArray);
      setNumOfShelves(shelvesArray.length);
      const updatedShelvesNumOfBooks = {};

      shelvesArray.forEach((element) => {
        updatedShelvesNumOfBooks[element.id] = element.books.length;
      });

      setShelvesNumOfBooks(updatedShelvesNumOfBooks);
      //sync history data
      const historyArray = response.data.data.History;
      setAllHistoryBooks(historyArray);
      setNumOfHistoryBooks(historyArray.length);
      setActiveMenuItem({ History: historyArray });
      setCurrentBooks(historyArray);
      //sync wishlist data
      const wishlistArray = response.data.data.Wishlist;
      setAllWishlistBooks(wishlistArray);
      setnumOfWishlistBooks(wishlistArray.length);
    } catch (error) {
      console.error("Error fetching shelves data:", error);
      setError("There was a problem loading your shelves data.");
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
      console.log(response.data);
      if (response.data.result) {
        const added_shelf = response.data.data;
        setAllShelvesWithBooks([...allShelvesWithBooks, added_shelf]);
        setNumOfShelves((prevNumOfShelves) => prevNumOfShelves + 1);
      }
      console.log("add shelf request output: ", response.data);
      return response.data.result;
    } catch (error) {
      console.error("Error adding new shelf:", error);
      setError("There was a problem adding your new shelf.");
    }
  };

  const editShelf = async (shelfData) => {
    try {
      const response = await axios.put(`${api_url}library/edit_shelf/`, {
        user_id: savedUser.id,
        shelf: shelfData,
      });
      console.log(response.data);
      if (response.data.result) {
        const added_shelf = response.data.data;
        setAllShelvesWithBooks((prevShelves) =>
          prevShelves.map((shelf) =>
            shelf.id === added_shelf.id ? { ...shelf, ...added_shelf } : shelf
          )
        );
      }
      console.log("edit shelf request output: ", response.data);
      return response.data.result;
    } catch (error) {
      console.error("Error editing shelf:", error);
      setError("There was a problem editing your shelf.");
    }
  };

  const removeShelf = async (shelf_id) => {
    try {
      const response = await axios.delete(`${api_url}library/remove_shelf/`, {
        params: {
          user_id: savedUser.id,
          shelf_id: shelf_id,
        },
      });
      if (response.data.result) {
        setAllShelvesWithBooks(
          allShelvesWithBooks.filter((shelf) => shelf.id !== shelf_id)
        );
        setNumOfShelves((prevNumOfShelves) => prevNumOfShelves - 1);
      }
      console.log("remove shelf request output: ", response.data.result);
      return response.data.result;
    } catch (error) {
      console.error("Error removing shelf:", error);
      setError("There was a problem removing your shelf.");
    }
  };

  const removeBookFromShelf = async (shelf_id, book_id) => {
    try {
      const response = await axios.delete(
        `${api_url}library/remove_book_from_shelf/`,
        {
          params: {
            shelf_id: shelf_id,
            book_id: book_id,
          },
        }
      );
      const result = response.data.data;
      console.log("remove book from shelf request result: ", result);
      if (result) {
        const updatedShelves = allShelvesWithBooks.map((shelf) =>
          shelf.id === shelf_id
            ? {
                ...shelf,
                books: shelf.books.filter((book) => book.book_id !== book_id),
              }
            : shelf
        );

        setAllShelvesWithBooks(updatedShelves);
        setCurrentBooks(
          currentBooks.filter((book) => book.book_id !== book_id)
        );
        setShelvesNumOfBooks((prevShelvesNumOfBooks) => {
          const updatedShelvesNumOfBooks = { ...prevShelvesNumOfBooks };
          if (updatedShelvesNumOfBooks[shelf_id] !== undefined) {
            updatedShelvesNumOfBooks[shelf_id] -= 1;
          }
          return updatedShelvesNumOfBooks;
        });
      }
    } catch (error) {
      console.error("Error removing book from shelf:", error);
      setError("There was a problem removing book from shelf.");
    }
  };

  const removeBookFromWishlist = async (book_id) => {
    try {
      const response = await axios.delete(
        `${api_url}library/remove_book_from_wishlist/`,
        {
          params: {
            user_id: savedUser.id,
            book_id: book_id,
          },
        }
      );
      const result = response.data.data;
      console.log("remove book from wishlist request result: ", result);
      if (result) {
        setAllWishlistBooks(
          allWishlistBooks.filter((book) => book.book_id !== book_id)
        );
        setCurrentBooks(
          currentBooks.filter((book) => book.book_id !== book_id)
        );
        setnumOfWishlistBooks(
          (prevNumOfWishListBooks) => prevNumOfWishListBooks - 1
        );
      }
    } catch (error) {
      console.error("Error removing book from wishlist:", error);
      setError("There was a problem removing book from wishlist.");
    }
  };

  const removeBookFromHistory = async (book_id) => {
    try {
      const response = await axios.delete(
        `${api_url}library/remove_book_from_history/`,
        {
          params: {
            user_id: savedUser.id,
            book_id: book_id,
          },
        }
      );
      const result = response.data.data;
      console.log("remove book from history request result: ", result);
      if (result) {
        setAllHistoryBooks(
          allHistoryBooks.filter((book) => book.book_id !== book_id)
        );
        setCurrentBooks(
          currentBooks.filter((book) => book.book_id !== book_id)
        );
        setNumOfHistoryBooks(
          (prevNumOfHistoryBooks) => prevNumOfHistoryBooks - 1
        );
      }
    } catch (error) {
      console.error("Error removing book from history:", error);
      setError("There was a problem removing book from history.");
    }
  };

  //==================================================Use Effect======================================================
  useEffect(() => {
    fetchLibraryData();
    if (error) {
      // Automatically clear the error after 5 seconds
      const timer = setTimeout(() => {
        setError("");
      }, 5000);

      // Cleanup the timer if the component unmounts or error changes
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

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
        <a style={{ marginLeft: "20px", fontSize: "16px" }}>
          <Icon name="clone outline" /> More Books
        </a>
      </div>
      <div style={{ display: "flex", gap: "16px" }}>
        <Menu
          vertical
          style={{
            width: "320px",
            minWidth: "320px",
            maxWidth: "320px",
            fontSize: "16px",
          }}
        >
          <Menu.Item
            onClick={() =>
              handleItemClick({ History: allHistoryBooks }, "History")
            }
            style={{
              backgroundColor: activeMenuItem.History
                ? "#e6f7ff"
                : "transparent",
              color: activeMenuItem.History ? "#1e90ff" : "inherit",
              borderRadius: activeMenuItem.History ? "12px" : "0",
              padding: "20px",
              cursor: "pointer",
              transition: "background-color 0.3s, color 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#f0f4f8")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = activeMenuItem.History
                ? "#e6f7ff"
                : "transparent")
            }
          >
            <Icon
              name="book"
              style={{
                color: activeMenuItem.History ? "#1e90ff" : "inherit",
              }}
            />{" "}
            History
            <span style={{ float: "right" }}>{numOfHistoryBooks}</span>
          </Menu.Item>

          <Menu.Item
            onClick={() =>
              handleItemClick({ Wishlist: allWishlistBooks }, "Wishlist")
            }
            style={{
              backgroundColor: activeMenuItem.Wishlist
                ? "#e6f7ff"
                : "transparent",
              color: activeMenuItem.Wishlist ? "#1e90ff" : "inherit", // Change text color when active
              borderRadius: activeMenuItem.Wishlist ? "12px" : "0",
              padding: "20px",
              cursor: "pointer",
              transition: "background-color 0.3s, color 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#f0f4f8")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = activeMenuItem.Wishlist
                ? "#e6f7ff"
                : "transparent")
            }
          >
            <Icon
              name="heart"
              style={{
                color: activeMenuItem.Wishlist ? "#1e90ff" : "inherit",
              }}
            />{" "}
            Wishlist
            <span style={{ float: "right" }}>{numOfWishlistBooks}</span>
          </Menu.Item>
          <Accordion as={Menu.Item}>
            <Accordion.Title
              active={activeShelvesAccordion}
              index={0}
              onClick={handleActiveShelvesAccordionClick}
              style={{
                display: "flex",
                justifyContent: "space-between",
                backgroundColor: "transparent",
                color: "inherit",
                borderRadius: "0",
                cursor: "pointer",
                transition: "background-color 0.3s, color 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f0f4f8")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <Icon
                name={activeShelvesAccordion ? "angle up" : "angle down"}
                style={{
                  color: "inherit",
                }}
              />
              <span>Shelves</span>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: "8px" }}>{numOfShelves}</span>
                <Icon
                  name="th"
                  style={{
                    color: "inherit",
                  }}
                />
              </div>
            </Accordion.Title>
            <Accordion.Content active={activeShelvesAccordion}>
              {allShelvesWithBooks && allShelvesWithBooks.length > 0 ? (
                <div
                  style={{
                    maxHeight: "500px",
                    overflowY:
                      allShelvesWithBooks.length > 8 ? "auto" : "visible",
                  }}
                >
                  {allShelvesWithBooks.map((shelf, index) => (
                    <Menu.Item
                      onClick={() =>
                        handleItemClick(
                          {
                            [shelf.name]: shelf,
                          },
                          shelf.name
                        )
                      }
                      key={index}
                      style={{
                        backgroundColor:
                          shelf.name in activeMenuItem
                            ? "#e6f7ff"
                            : "transparent",
                        color:
                          shelf.name in activeMenuItem ? "#1e90ff" : "inherit",
                        borderRadius:
                          shelf.name in activeMenuItem ? "12px" : "0",
                        padding: "10px",
                        cursor: "pointer",
                        transition: "background-color 0.3s, color 0.3s",
                      }}
                      onMouseEnter={(e) => {
                        setShelvesMoreHoveredId(index);
                        e.currentTarget.style.backgroundColor = "#f0f4f8";
                      }}
                      onMouseLeave={(e) => {
                        setShelvesMoreHoveredId(null);
                        e.currentTarget.style.backgroundColor =
                          shelf.name in activeMenuItem
                            ? "#e6f7ff"
                            : "transparent";
                      }}
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
                                color: getBackgroundColor(
                                  shelf.background_color
                                ),
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
                        </div>

                        {shelvesMoreHoveredId === index ? (
                          <div
                            style={{
                              position: "relative",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              backgroundColor: "#f0f4f8",
                              transition: "background-color 0.3s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#b3e5fc";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "#f0f4f8";
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <Dropdown
                              pointing="right"
                              icon={null}
                              trigger={
                                <Icon
                                  name="ellipsis vertical"
                                  style={{
                                    fontSize: "16px",
                                    color: "#1e90ff",
                                    cursor: "pointer",
                                    zIndex: -1,
                                  }}
                                  onClick={() => {
                                    setCurrentShelfSelected(shelf);
                                  }}
                                />
                              }
                              style={{ position: "absolute", zIndex: 3 }}
                            >
                              <Dropdown.Menu>
                                {shelvesMoreOptions.map((option, index) => (
                                  <Dropdown.Item
                                    key={index}
                                    text={option.text}
                                    onClick={() =>
                                      handleShelvesMoreOptionsClick(
                                        option.value,
                                        shelf
                                      )
                                    }
                                  />
                                ))}
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        ) : (
                          <span>{shelf.books.length}</span>
                        )}
                      </div>
                    </Menu.Item>
                  ))}
                </div>
              ) : (
                <></>
              )}
            </Accordion.Content>
          </Accordion>

          <Menu.Item
            onClick={() => handleCreateEditShelfClick("create")}
            style={{ color: "#1e90ff", padding: "20px" }}
          >
            <Icon name="plus" style={{ color: "#1e90ff" }} /> Create shelf
          </Menu.Item>
        </Menu>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{ display: "flex", alignItems: "top", marginBottom: "15px" }}
          >
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
                  if (query) setQuery("");
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
                      height: "460px",
                      margin: "15px",
                    }}
                  >
                    <Card.Content>
                      <div
                        style={{
                          width: "200px",
                          height: "230px",
                          overflow: "hidden",
                          borderRadius: "8px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          margin: "0 auto",
                        }}
                      >
                        <Image
                          src={book.book_cover}
                          alt={book.book_name}
                          wrapped
                          ui={false}
                          style={{
                            width: "180px",
                            height: "230px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    </Card.Content>

                    <Card.Content>
                      <Card.Header>{book.book_name}</Card.Header>
                      <Card.Meta>{book.author}</Card.Meta>
                      {book.genres.map((genre, index) => (
                        <div
                          key={index}
                          style={{
                            display: "inline-block",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            padding: "4px 8px",
                            margin: "4px",
                            color: "gray",
                            fontSize: "12px",
                          }}
                        >
                          {genre}
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
                            {(activeMenuItem.History || activeMenuItem.Wishlist
                              ? HistoryWishlistBookMoreOptions
                              : ShelvesBookMoreOptions
                            ).map((option) => (
                              <Dropdown.Item
                                onClick={() =>
                                  handleCardMoreOptionsClick(
                                    option.value,
                                    book.book_id
                                  )
                                }
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
        open={createEditShelfWindowIsOpen}
        onClose={() => setCreateEditShelfWindowIsOpen(false)}
        size="tiny"
        closeIcon
      >
        <Modal.Header>
          {isCreating ? "Create a " : "Edit this "} shelf
        </Modal.Header>
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
          <Button onClick={() => setCreateEditShelfWindowIsOpen(false)}>
            Cancel
          </Button>
          <Button
            primary
            onClick={() =>
              handleCreateEditShelfConfirmClick(
                isCreating ? "create" : "edit",
                currentShelfSelected
              )
            }
            disabled={!shelfName.trim()} // Disable if the input is empty
          >
            {isCreating ? "Create" : "Save"}
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default Library;
