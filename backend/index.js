require("dotenv").config();
const express = require("express");
const app = express();
const usersRouter = require("./routes/users");
const mediaRouter = require("./routes/media");
const ratingsRouter = require("./routes/ratings");
const mediaSearchRouter = require("./routes/mediaSearch");
const cors = require("cors");
const { requestLogger } = require("./middleware/logger");

// helps to convert the request body into a JSON format
app.use(express.json());
app.use(requestLogger);
app.use(cors());

// Route handlers
app.use("/api/users", usersRouter);
app.use("/api/media", mediaRouter);
app.use("/api/media/search", mediaSearchRouter);
app.use("/api/", ratingsRouter);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`PlotThePlot backend server running on port ${PORT}.`);
});
