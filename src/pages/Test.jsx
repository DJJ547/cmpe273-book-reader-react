import React from "react";
import TestSearchBox from "../components/test/TestSearchBox";
import TestSearchBoxPagination from "../components/test/TestSearchBoxPagination";
import TestGetSpecificBooks from "../components/test/TestGetSpecificBooks";
import TestGetBookReviews from "../components/test/TestGetBookReviews";
import TestGoogleAuth from "../components/test/testAuth/TestGoogleAuth";
export default function Test() {
  return (
    <div className="flex-col space-y-10">
      <h1 className="text-4xl text-bold">Below are all the test components:</h1>
      <TestGoogleAuth />
      <TestSearchBox />
      <TestSearchBoxPagination />
      <TestGetSpecificBooks genre="Popular Books" maxResults={15} />
      <TestGetSpecificBooks genre="Bestsellers" maxResults={15} />
      <TestGetBookReviews />
    </div>
  );
}
