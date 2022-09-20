const express = require("express");
const dotenv = require('dotenv');

dotenv.config();
const dbConnect = require('./config/database/dbConnect');

const app = express();

// database connect
dbConnect();

// server
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server is running... ${PORT}`));
