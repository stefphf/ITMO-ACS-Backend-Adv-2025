import express = require("express");
import SETTINGS from "./config/settings";
import userRouter from "./routes/UserRouter";
import recipeRouter from "./routes/RecipeRouter";
import socialRouter from "./routes/SocialRouter";
var cors = require('cors');

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"],
  exposedHeaders: ["Authorization"],
  credentials: true,
  optionsSuccessStatus: 204
};

let app = express();
app.get("/", (_, res) => {res.json({"status": "ok"})})

app.use(cors(corsOptions))
app.use(userRouter);
app.use(recipeRouter);
app.use(socialRouter);

app.listen(SETTINGS.APP_PORT, () => {
    console.log(`API Gateway running on port ${SETTINGS.APP_PORT}`)
});