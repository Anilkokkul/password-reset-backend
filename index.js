const express = require("express");
require("dotenv").config();
const { db } = require("./db/connect");
const userRoutes = require("./routes/auth.routes");

const app = express();
db();

app.use(express.json());
app.use(userRoutes);

port = process.env.PORT || 8001;

app.get("/", (req, res) => {
  res.send("<h1>Welcome to the Password Reset flow App</h1>");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
