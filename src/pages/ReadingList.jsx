import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Container,
  Card,
  Grid,
  Header,
  Image,
  Icon,
  Button,
  Popup
} from "semantic-ui-react";

const ReadingList = () => {
  const location = useLocation();
  console.log(location.state);
  const { books } = location.state || {};

  const [activePopupId, setActivePopupId] = useState(null);

  const handleMoreClick = (id) => {
    setActivePopupId(id);
  };

  return (
    <Container style={{ marginTop: "2em", textAlign: "center" }}>
      <Header as="h1" textAlign="center">
        Reading List Books
      </Header>
      <Grid columns={4} padded>
        {books &&
          books.map((book) => (
            <Grid.Column key={book.id} style={{ padding: "1em" }}>
              <Card
                raised
                style={{
                  margin: "0 auto",
                  maxWidth: "250px",
                  maxHeight: "550px",
                }}
              >
                <Image
                  src={book.book_cover}
                  alt={`${book.book_name} cover`}
                  wrapped
                  ui={false}
                  style={{
                    width: "180px",
                    height: "250px",
                    objectFit: "cover",
                    margin: "0 auto 10px auto", // Centering image horizontally
                  }}
                />
                <Card.Content>
                  <Card.Header style={{ textAlign: "center" }}>
                    {book.book_name}
                  </Card.Header>
                  <Card.Meta
                    style={{ marginBottom: "10px", textAlign: "center" }}
                  >
                    <span>{`Author: ${book.author}`}</span>
                  </Card.Meta>
                  <Card.Description
                    style={{
                      maxHeight: "100px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
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
                          <p>{book.description}</p>
                        </div>
                      }
                      open={activePopupId === book.id}
                      onClose={() => setActivePopupId(null)}
                      trigger={
                        <span className="truncated-description">
                          {book.description.slice(0, 50)}
                          {book.description.length > 50 && (
                            <>
                              ...{" "}
                              <span
                                onClick={() => handleMoreClick(book.id)}
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
                </Card.Content>
                <Card.Content
                  extra
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>
                    <Icon name="book" /> {`Chapters: ${book.num_of_chapters}`}
                  </span>
                  <Button primary size="mini">
                    View More
                  </Button>
                </Card.Content>
              </Card>
            </Grid.Column>
          ))}
      </Grid>
    </Container>
  );
};

export default ReadingList;
