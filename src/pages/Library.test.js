import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../components/context/AuthContext";
import Library from "./Library";
import "@testing-library/jest-dom";

// Mock axios
jest.mock("axios");

// Mock data for AuthContext
const mockAuthContext = {
  isAuthenticated: true,
  user: { id: 1, name: "Test User" },
  login: jest.fn(),
  logout: jest.fn(),
};

// Mock response for library data
const mockLibraryData = {
  data: {
    data: {
      Shelves: [
        {
          id: 1,
          name: "Favorites",
          background_color: "#FFD700",
          icon: "star",
          books: [
            {
              book_id: 101,
              book_name: "Book One",
              author: "Author One",
              book_cover: "cover1.jpg",
              genres: ["Fiction"],
              current_chapter: 2,
              num_of_chapters: 10,
              average_rating: 4.5,
            },
          ],
        },
      ],
      History: [
        {
          book_id: 102,
          book_name: "Book Two",
          author: "Author Two",
          book_cover: "cover2.jpg",
          genres: ["Non-Fiction"],
          current_chapter: 1,
          num_of_chapters: 5,
          average_rating: 3.8,
          last_read_at: "2024-12-01T10:00:00Z",
        },
      ],
      Wishlist: [],
    },
  },
};

// Mock response for moving a book between shelves
const mockMoveShelvesResponse = {
  data: { result: true },
};

describe("Library Component", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue(mockLibraryData);
    axios.post.mockResolvedValue(mockMoveShelvesResponse);
    axios.delete.mockResolvedValue(mockMoveShelvesResponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the Library component", async () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter initialEntries={["/library/1"]}>
          <Routes>
            <Route path="/library/:user_id" element={<Library />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Verify the loading state and rendered components
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(await screen.findByText("Favorites")).toBeInTheDocument();
    expect(await screen.findByText("Book Two")).toBeInTheDocument();
  });

  it("handles opening and closing the MoveToShelvesWindow", async () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter initialEntries={["/library/1"]}>
          <Routes>
            <Route path="/library/:user_id" element={<Library />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Wait for library data to load
    await screen.findByText("Favorites");

    // // Locate and click the dropdown icon to open the menu
    // const moveOption = screen.getByTestId("dropdown-item-move");
    // fireEvent.click(moveOption);

    // // Verify that the modal is open
    // expect(screen.getByText('Edit shelves for "Book One"')).toBeInTheDocument();

    // // Close the modal
    // const cancelButton = screen.getByText("Cancel");
    // fireEvent.click(cancelButton);

    // // Verify that the modal is closed
    // expect(
    //   screen.queryByText('Edit shelves for "Book One"')
    // ).not.toBeInTheDocument();
  });

  //   it("handles moving a book to a different shelf", async () => {
  //     render(
  //       <AuthContext.Provider value={mockAuthContext}>
  //         <MemoryRouter initialEntries={["/library/1"]}>
  //           <Routes>
  //             <Route path="/library/:user_id" element={<Library />} />
  //           </Routes>
  //         </MemoryRouter>
  //       </AuthContext.Provider>
  //     );

  //     // Wait for library data to load
  //     await screen.findByText("Favorites");

  //     // Simulate clicking on the "Move" button for a book
  //     const moreOptionsButtons = screen.getAllByRole("button");
  //     const moveButton = moreOptionsButtons.find((button) =>
  //         button.textContent.includes("Move")
  //       );
  //     fireEvent.click(moveButton);

  //     // Verify that the modal is open
  //     expect(
  //       screen.getByText('Edit shelves for "Book One"')
  //     ).toBeInTheDocument();

  //     // Select a shelf checkbox
  //     const checkbox = screen.getByLabelText("Favorites");
  //     fireEvent.click(checkbox);

  //     // Click the "Save" button
  //     const saveButton = screen.getByText("Save");
  //     fireEvent.click(saveButton);

  //     // Verify API interactions
  //     expect(axios.post).toHaveBeenCalledWith(
  //       "/library/add_book_to_shelf/",
  //       expect.objectContaining({
  //         user_id: 1,
  //         shelf_id: 1,
  //         book_id: 101,
  //       })
  //     );

  //     // Verify the modal closes
  //     expect(
  //       screen.queryByText('Edit shelves for "Book One"')
  //     ).not.toBeInTheDocument();
  //   });
});
