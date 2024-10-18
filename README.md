## Frontend Project Layout
```
cmpe281frontend/
├── public/
│   ├── index.html
├── src/
│   ├── App.css
│   ├── App.js
│   ├── index.css
│   ├── index.js
│   ├── components/            (all components should go in this folder)
│   │   ├── pageLayout/
│   │   │   ├── Navbar.jsx     (we all share the same navbar)
│   │   ├── test/              (all sample test components)
│   │   │   ├── testAuth/      (all sample test auth components)
│   │   │   │   ├──TestAuth.jsx
│   │   │   │   ├──TestGoogleAuth.jsx   (sample Google OAuth2 authentication)
│   │   │   ├── TestGetBookReviews.jsx  (sample to retrive user book ratings from Google Books APIs)
│   │   │   ├── TestGetBookShelves.jsx  (sample to retrive user book reading lists from Google Books APIs)
│   │   │   ├── TestGetSpecificBooks.jsx(sample to retrive book genres from Google Books APIs)
│   │   │   ├── TestSearchBox.jsx       (sample to retrive book title search result from Google Books APIs)
│   │   │   ├── TestSearchBoxPagination.jsx(sample to retrive book title search result with pagination from Google Books APIs)
│   ├── medias/                (for any frontend-used images etc.)
│   ├── mockData/              (all mock data go in this folder)
│   ├── pages/                 (all pages should go in this folder)
│   │   ├── auth/              (user authentication pages)
│   │   │   ├── Login.jsx      (user login page)
│   │   │   ├── Signup.jsx     (user signup page)
│   │   ├── BookHistory.jsx    (user book history page)
│   │   ├── BookList.jsx       (user favourite book list page)
│   │   ├── Main.jsx           (bookstore main page)
│   │   ├── Test.jsx           (for testing)
│   ├── utils/                 (for any helper functions)
├── .env                       (create a file named ".env" to store all private username & password,it will be ignored)
├── gitignore
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwindcss.config.js
```
  
## How to run our React front-end locally:
- install node.js. https://nodejs.org/en
- download the .env file from this link: https://drive.google.com/file/d/1KJRmaO_lE-WbJkpyK9upDMO1GjOV9IKE/view?usp=sharing, put/replace it to the root directory.
- run the following command to install the dependencies and neccessary files for this project.
```
npm install
```
- Now you can start your frontend locally with:
```
npm start
``` 
## Some sample Google OAuth2 and Google Books APIs are in the "test" folder, to play with them just navigate to http://localhost:3000/test