const express = require("express");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const customerRoutes = require("./router/auth_users.js").authenticated;
const generalRoutes = require("./router/general.js").general;

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "book-review-course-project-secret";

app.use(express.json());
app.use("/customer", session({
  secret: process.env.SESSION_SECRET || "fingerprint_customer",
  resave: false,
  saveUninitialized: false
}));

app.use("/customer/auth", (req, res, next) => {
  const [scheme, token] = (req.headers.authorization || "").split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Authentication token required" });
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
});

app.use("/customer", customerRoutes);
app.use("/", generalRoutes);
app.get("/health", (req, res) => res.json({ status: "ok" }));

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}
module.exports = app;
