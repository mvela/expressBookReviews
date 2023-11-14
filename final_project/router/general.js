const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let authenticatedUser = require("./auth_users.js").authenticatedUser;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
  //with axios
  try {
    // const response = await axios.get("example api");
    const response = books;
    return res.status(200).json({ books });
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //with promise
  new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (!book) {
      reject("Book not found");
    } else {
      resolve(book);
    }
  })
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => {
      return res.status(404).json({ message: "Book not found" });
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  new Promise((resolve, reject) => {
    const booksByAuthor = Object.values(books).filter(
      (book) => book.author === author
    );
    if (booksByAuthor.length === 0) {
      reject("No books found for this author");
    } else {
      resolve(booksByAuthor);
    }
  })
    .then((booksByAuthor) => {
      res.status(200).json({ books: booksByAuthor });
    })
    .catch((error) => {
      return res.status(404).json({ message: error });
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    const booksBytitle = Object.values(books).filter(
      (book) => book.title === title
    );
    if (booksBytitle.length === 0) {
      reject("No books found for this title");
    } else {
      resolve(booksBytitle);
    }
  })
    .then((booksBytitle) => {
      res.status(200).json({ books: booksBytitle });
    })
    .catch((error) => {
      return res.status(404).json({ message: error });
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  const reviews = book.reviews;
  return res.status(200).json({ reviews });
});

module.exports.general = public_users;
