import express from "express";
import "dotenv/config";
import "express-async-errors";
import "./db";
import authRouter from "./routes/authRouter";
import audioRouter from "./routes/audioRouter";
import favoriteRouter from "./routes/favoriteRouter";
import playlistRouter from "./routes/playlistRouter";
import profileRouter from "./routes/profileRouter";
import historyRouter from "./routes/historyRouter";
import "./utils/schedule";
import { errorHandler } from "./middlewares/async-error";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);
app.use("/audio", audioRouter);
app.use("/favorite", favoriteRouter);
app.use("/playlist", playlistRouter);
app.use("/profile", profileRouter);
app.use("/history", historyRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("\u001b[1;32mApp is running at port " + PORT);
});
