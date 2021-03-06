const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");

const { mongoDBConnection } = require("./db/db.connect");
const user = require("./routes/users.router");
const labels = require("./routes/labels.router");
const labelsList = require("./routes/labelsList.router");
const notes = require("./routes/notes.router");
const notesList = require("./routes/notesList.router");

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoDBConnection();

app.use("/user", user);
app.use("/notes", notes);
app.use("/notes-list", notesList);
app.use("/labels", labels);
app.use("/labels-list", labelsList);

app.get('/', (req, res) => {
  res.send('Hello Express app!')
});

app.use((req, res) => {
  res.status(400).json({
    success: false,
    messageg: "Route not found on server, please check."
  });
});

app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({
    success: false,
    message: "error occurred, see the errorMessage key for more details",
    errorMessage: error.message
  });
});

app.listen(3000, () => {
  console.log('server started');
});