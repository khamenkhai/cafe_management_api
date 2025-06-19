require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./connection"); // Now this is the direct connection
const userRoutes = require("./routes/user_routes");

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});