require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./connection"); 
const authentication = require("./services/authentication");
const checkRole = require("./services/checkRole");
const userRoutes = require("./routes/user_routes");
const categoryRoutes = require("./routes/category_routes");
const productRoutes = require("./routes/product-routes");

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});