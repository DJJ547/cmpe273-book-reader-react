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
│   ├── medias/                (for any frontend-used images etc.)
│   ├── mockData/              (all mock data go in this folder)
│   ├── pages/                 (all pages should go in this folder)
│   │   ├── auth/              (user authentication pages)
│   │   │   ├── Login.jsx      (user login page)
│   │   │   ├── Signup.jsx     (user signup page)
│   │   ├── BookHistory.jsx    (user book history page)
│   │   ├── BookList.jsx       (user favourite book list page)
│   │   ├── Main.jsx           (bookstore main page)
│   │   ├── Test.jsx           (for your own testing, do not commit)
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
- after installation of node.js. run the following command to install the dependencies and neccessary files for this project.
```
npm install
```
- Now you can start your frontend locally with:
```
npm start
``` 
