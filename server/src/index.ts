import express from "express";
import "dotenv/config";
import "./db";
import authRouter from "./routes/authRouter";
import audioRouter from "./routes/audioRouter";
import favoriteRouter from "./routes/favoriteRouter";
import playlistRouter from "./routes/playlistRouter";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);
app.use("/audio", audioRouter);
app.use("/favorite", favoriteRouter);
app.use("/playlist", playlistRouter);

app.listen(PORT, () => {
  console.log("App is running at port " + PORT);
});
