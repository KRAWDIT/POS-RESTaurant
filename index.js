const express = require("express");
const app = express();
const port = 3000;
const { usersRouter, busRouter } = require("./routes");
const cors = require("cors");
app.use(cors());
app.use(express.json());
// const Sequelize = require("sequelize");
// const Models = require("./models");
// Models.sequelize
//   .sync({
//     force: false,
//     alter: true,
//     logging: console.log,
//   })
//   .then(function () {
//     console.log("Database is Synchronized!");
//   })
//   .catch(function (err) {
//     console.log(err, "Something Went Wrong with Database Update!");
// });

app.use("/users", usersRouter);
// app.use("/bus", busRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
