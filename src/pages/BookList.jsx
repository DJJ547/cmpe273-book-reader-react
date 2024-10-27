import React, { useState, useEffect } from "react";

const BookList = () => {
  const [bookshelves, setBookshelves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const displayBookList = []

  useEffect(() => {
    const fetchReadingLists = async () => {
      const savedUser = localStorage.getItem("user");
      if (!savedUser) {
        setError("You must be logged in to access the reading lists.");
        setLoading(false);
        return;
      }

      const user = JSON.parse(savedUser);
      const token = user.token;

      try {
        // Fetch user's reading lists using the Google Books API
        const response = await fetch(
          "https://www.googleapis.com/books/v1/mylibrary/bookshelves",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch reading lists.");
        }

        const data = await response.json();
        console.log(data)
        setBookshelves(data.items || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReadingLists();
  }, []);

  if (loading) {
    return <div>Loading your reading lists...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">My Google Reading Lists</h1>
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">List Title</th>
            <th className="border p-2 text-left">Book Amount</th>
            <th className="border p-2 text-left">Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {bookshelves.map((shelf) => (
            <tr key={shelf.id} className="border-t">
              <td className="border p-2">
                <a href={`/shelf/${shelf.id}`} className="text-blue-500 hover:underline">
                  {shelf.title}
                </a>
              </td>
              <td className="border p-2">{shelf.volumeCount || 0}</td>
              <td className="border p-2">{shelf.updated || "/"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookList;
