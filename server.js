const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const dbConnect = require("./config/database/dbConnect");

const userRoutes = require("./routes/users/usersRoute");
const { errorHandler, notFound } = require("./middlewares/errors/errorHandler");

const app = express();

// database connect
dbConnect();

// middleware
app.use(express.json());

// users route
app.use("/api/users", userRoutes);

//error handlers
app.use(notFound);
app.use(errorHandler);

// server
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server is running... ${PORT}`));