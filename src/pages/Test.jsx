import React from "react";
import TestSearchBox from "../components/test/TestSearchBox";
import TestGetBooksByGenre from "../components/test/TestGetBooksByGenre";
import TestGetBookReviews from "../components/test/TestGetBookReviews";
import TestGoogleAuth from "../components/test/testAuth/TestGoogleAuth";
export default function Test() {
  return (
    <div className="flex-col space-y-10">
      <h1 className="text-4xl text-bold">Below are all the test components:</h1>
      <TestGoogleAuth />
      <TestSearchBox page={1} page_size={20}/>
      <TestGetBooksByGenre genre="science" maxResults={15} />
      <TestGetBooksByGenre genre="fantasy" maxResults={15} />
      <TestGetBookReviews />
    </div>
  );
}
