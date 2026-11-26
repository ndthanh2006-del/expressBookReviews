const express = require("express");
const jwt = require("jsonwebtoken");
const books = require("./booksdb.js");
const regd_users = express.Router();
const users = [];
const JWT_SECRET = process.env.JWT_SECRET || "book-review-course-project-secret";

const isValid = (username) =>
  typeof username === "string" && username.trim().length > 0 &&
  users.some((user) => user.username === username.trim());

const authenticatedUser = (username, password) =>
  users.some((user) => user.username === username && user.password === password);

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password)
    return res.status(400).json({ message: "Username and password are required" });
  if (!authenticatedUser(username, password))
    return res.status(401).json({ message: "Invalid username or password" });

  const accessToken = jwt.sign({ username }, JWT_SECRET, { expiresIn: "2h" });
  return res.status(200).json({ message: "Login successful", accessToken });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  const review = req.body && req.body.review;
  if (typeof review !== "string" || !review.trim())
    return res.status(400).json({ message: "A non-empty review is required" });
  book.reviews[req.user.username] = review.trim();
  return res.status(200).json({ message: "Review added/updated successfully", reviews: book.reviews });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  if (!Object.prototype.hasOwnProperty.call(book.reviews, req.user.username))
    return res.status(404).json({ message: "You have not reviewed this book" });
  delete book.reviews[req.user.username];
  return res.status(200).json({ message: "Your review was deleted successfully", reviews: book.reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.authenticatedUser = authenticatedUser;
module.exports.users = users;
