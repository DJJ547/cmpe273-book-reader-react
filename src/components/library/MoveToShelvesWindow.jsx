import React, { useState, useEffect } from "react";
import { Modal, Button } from "semantic-ui-react";
import { useAuth } from "../../components/context/AuthContext";
import axios from "axios";

const MoveToShelvesWindow = ({
  moveToShelvesWindowIsOpen,
  setMoveToShelvesWindowIsOpen,
  currentBook,
  setCurrentBook, //Optional
  allShelvesWithBooks, //Optional
  setAllShelvesWithBooks, //Optional
  handleCreateEditShelfClick, //Optional
  setShelvesNumOfBooks, //Optional
  setCurrentBooks, //Optional
  setError, //Optional
}) => {
  const [localShelvesWithBooks, setLocalShelvesWithBooks] = useState([]);
  const [localSelectedShelves, setLocalSelectedShelves] = useState([]);
  const { user } = useAuth();
  //Move Shelf to Another Shelf
  const handleMoveShelfToAnotherShelfConformClick = async () => {
    try {
      // Remove book from unselected shelves
      const unselectedShelves = (allShelvesWithBooks || localShelvesWithBooks)
        .filter((shelf) => !localSelectedShelves.includes(shelf.id))
        .filter((shelf) =>
          shelf.books.some((b) => b.book_id === currentBook.book_id)
        );

      await Promise.all(
        unselectedShelves.map((shelf) =>
          removeBookFromShelf(shelf.id, currentBook.book_id)
        )
      );

      // Add book to selected shelves
      const newlySelectedShelves = localSelectedShelves.filter(
        (shelfId) =>
          !(allShelvesWithBooks || localShelvesWithBooks)
            .find((shelf) => shelf.id === shelfId)
            .books.some((b) => b.book_id === currentBook.book_id)
      );

      await Promise.all(
        newlySelectedShelves.map((shelfId) =>
          addBookToShelf(shelfId, currentBook.book_id)
        )
      );
      setMoveToShelvesWindowIsOpen(false);
      setLocalSelectedShelves([]);
      if (setCurrentBook) {
        setCurrentBook(null);
      }
    } catch (error) {
      console.error("Error saving shelves:", error);
      setError("There was a problem saving the shelves.");
    }
  };

  const handleShelfCheckboxToggle = (shelfId) => {
    setLocalSelectedShelves((prev) =>
      prev.includes(shelfId)
        ? prev.filter((id) => id !== shelfId)
        : [...prev, shelfId]
    );
  };

  //===================================API Requests==========================================
  const addBookToShelf = async (shelf_id, book_id) => {
    try {
      const response = await axios.post(`/library/add_book_to_shelf/`, {
        user_id: user.id,
        shelf_id: shelf_id,
        book_id: book_id,
      });
      const result = response.data.result;
      if (result && setAllShelvesWithBooks) {
        const added_book = response.data.data;
        setAllShelvesWithBooks((prevShelves) =>
          prevShelves.map((shelf) =>
            shelf.id === shelf_id
              ? { ...shelf, books: [...shelf.books, added_book] }
              : shelf
          )
        );
        setShelvesNumOfBooks((prevShelvesNumOfBooks) => {
          const updatedShelvesNumOfBooks = { ...prevShelvesNumOfBooks };
          if (updatedShelvesNumOfBooks[shelf_id] !== undefined) {
            updatedShelvesNumOfBooks[shelf_id] += 1;
          }
          return updatedShelvesNumOfBooks;
        });
      }
    } catch (error) {
      console.error("Error adding adding book to shelf:", error);
      setError("There was a problem adding book to shelf.");
    }
  };

  const removeBookFromShelf = async (shelf_id, book_id) => {
    try {
      const response = await axios.delete(`/library/remove_book_from_shelf/`, {
        params: {
          user_id: user.id,
          shelf_id: shelf_id,
          book_id: book_id,
        },
      });
      const result = response.data.result;
      if (result && setAllShelvesWithBooks) {
        const updatedShelves = (
          allShelvesWithBooks || localShelvesWithBooks
        ).map((shelf) =>
          shelf.id === shelf_id
            ? {
                ...shelf,
                books: shelf.books.filter((book) => book.book_id !== book_id),
              }
            : shelf
        );

        setAllShelvesWithBooks(updatedShelves);
        setCurrentBooks((prevBooks) =>
          prevBooks.filter((book) => book.book_id !== book_id)
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

  const fetchShelves = async () => {
    try {
      const response = await axios.get(`/library/get_shelves_data`, {
        params: { user_id: user.id },
      });
      const shelvesData = response.data.data;
      setLocalShelvesWithBooks(shelvesData); // Update local state
      const associatedShelves = shelvesData
        .filter((shelf) =>
          shelf.books.some((b) => b.book_id === currentBook.book_id)
        )
        .map((shelf) => shelf.id);
      setLocalSelectedShelves(associatedShelves);
    } catch (error) {
      console.error("Error fetching shelves:", error);
    }
  };

  useEffect(() => {
    if (moveToShelvesWindowIsOpen) {
      // if shelves with books data already provided by parent
      if (allShelvesWithBooks) {
        const associatedShelves = allShelvesWithBooks
          .filter((shelf) =>
            shelf.books.some((b) => b.book_id === currentBook.book_id)
          )
          .map((shelf) => shelf.id);
        setLocalSelectedShelves(associatedShelves);
      } else {
        fetchShelves();
      }
    }
  }, [moveToShelvesWindowIsOpen]);

  return (
    <Modal
      open={moveToShelvesWindowIsOpen}
      onClose={() => setMoveToShelvesWindowIsOpen(false)}
      size="tiny"
      closeIcon
    >
      <Modal.Header>Edit shelves for "{currentBook?.book_name}"</Modal.Header>
      <Modal.Content>
        <div
          style={{
            maxHeight: "200px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {(allShelvesWithBooks || localShelvesWithBooks)?.length > 0 &&
            (allShelvesWithBooks || localShelvesWithBooks).map((shelf) => (
              <div
                key={shelf.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <input
                  type="checkbox"
                  checked={localSelectedShelves.includes(shelf.id)}
                  onChange={() => handleShelfCheckboxToggle(shelf.id)}
                />
                <label style={{ marginLeft: "10px" }}>{shelf.name}</label>
              </div>
            ))}
        </div>
      </Modal.Content>
      <Modal.Actions
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {handleCreateEditShelfClick && (
          <Button
            onClick={() => handleCreateEditShelfClick("create")}
            style={{ alignSelf: "flex-start" }}
          >
            Create Shelf
          </Button>
        )}
        <div>
          <Button onClick={() => setMoveToShelvesWindowIsOpen(false)}>
            Cancel
          </Button>
          <Button primary onClick={handleMoveShelfToAnotherShelfConformClick}>
            Save
          </Button>
        </div>
      </Modal.Actions>
    </Modal>
  );
};

export default MoveToShelvesWindow;
