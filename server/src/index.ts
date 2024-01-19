import express from "express";
import "dotenv/config";
import "./db";
import authRouter from "./routes/authRouter";
import audioRouter from "./routes/audioRouter";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);
app.use("/audio", audioRouter);

app.listen(PORT, () => {
  console.log("App is running at port " + PORT);
});
