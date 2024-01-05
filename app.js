const express = require("express");
const app = express();
const port = 6150;
var bodyParser = require("body-parser");
const morgan = require("morgan");
const connectDB = require("./config/database");
const router = require("./routers");
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(cors());
app.use(cookieParser());
app.options("*", cors());
//middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("tiny"));

// parse application/json
app.use(express.json());
connectDB();
router(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
