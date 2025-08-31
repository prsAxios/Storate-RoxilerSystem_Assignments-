require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const { sequelize, Visitor } = require("./models");
const cors = require("cors");
const storeRouter = require("./router/store");
const userRouter = require("./router/users");

// allow access of the api
app.use(cors());

// Configure body parser for JSON and URL-encoded data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// connect to db
sequelize
  .authenticate()
  .then(() => console.log("Connected to Database"))
  .catch(() => console.log("Error Connecting to Database"));

const path = require("path");
const wrapAsync = require("./utils/wrapAsync");
app.use("/public", express.static(path.join(__dirname, "./public")));
app.use(express.urlencoded({ extended: false }));

app.use("/stores", storeRouter);
app.use("/users", userRouter);
app.post(
  "/log-visit",
  wrapAsync(async (req, res) => {
    const { userAgent } = req.body;
    ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    let visitor = await Visitor.findOne({ where: { ip } });

    if (visitor) {
      visitor.visitCount += 1;
      await visitor.save();
      const totalVisitors = await Visitor.count();
      return res.status(200).json({
        message: "Visit logged",
        newVisitor: false,
        totalVisitors,
        totalVisits: visitor.visitCount,
      });
    }
    visitor = await Visitor.create({ userAgent, ip });
    const totalVisitors = await Visitor.count();
    return res.status(200).json({
      message: "New visitor created",
      newVisitor: true,
      totalVisitors,
      totalVisits: visitor.visitCount,
    });
  })
);

app.get("/", (req, res) => {
  res.json({
    message: "This is home route",
  });
});

// managing errors
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).json({
    message: message,
  });
});

// setting up http server at port
sequelize.sync({ alter: true }).then(() => {
  app.listen(port, () => {
    console.log(`There server is running at ${port}`);
  });
});
