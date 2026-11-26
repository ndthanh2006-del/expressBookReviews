const express = require("express");
const axios = require("axios");
const books = require("./booksdb.js");
const { isValid, users } = require("./auth_users.js");
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body || {};
  if (typeof username !== "string" || !username.trim() ||
      typeof password !== "string" || !password)
    return res.status(400).json({ message: "Username and password are required" });
  const cleanUsername = username.trim();
  if (isValid(cleanUsername))
    return res.status(409).json({ message: "Username already exists" });
  users.push({ username: cleanUsername, password });
  return res.status(201).json({ message: "User registered successfully" });
});

public_users.get("/", (req, res) => res.status(200).json(books));

public_users.get("/isbn/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  return res.status(200).json(book);
});

public_users.get("/author/:author", (req, res) => {
  const term = req.params.author.toLowerCase();
  const matches = Object.values(books).filter(b => b.author.toLowerCase().includes(term));
  return res.status(200).json(matches);
});

public_users.get("/title/:title", (req, res) => {
  const term = req.params.title.toLowerCase();
  const matches = Object.values(books).filter(b => b.title.toLowerCase().includes(term));
  return res.status(200).json(matches);
});

public_users.get("/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  return res.status(200).json(book.reviews);
});

// Task 11: Axios client helpers using async/await to call this API.
const API_BASE_URL = process.env.BOOK_API_URL || "http://localhost:5000";
const getAllBooks = async () => (await axios.get(`${API_BASE_URL}/`)).data;
const getBookByISBN = async (isbn) =>
  (await axios.get(`${API_BASE_URL}/isbn/${encodeURIComponent(isbn)}`)).data;
const getBooksByAuthor = async (author) =>
  (await axios.get(`${API_BASE_URL}/author/${encodeURIComponent(author)}`)).data;
const getBooksByTitle = async (title) =>
  (await axios.get(`${API_BASE_URL}/title/${encodeURIComponent(title)}`)).data;

module.exports.general = public_users;
module.exports.bookApi = { getAllBooks, getBookByISBN, getBooksByAuthor, getBooksByTitle };
