import mongoose from "mongoose";
import {URI} from "#/utils/variables";

mongoose.set("strictQuery", true);
mongoose
  .connect(URI)
  .then(() => {
    console.log("Connected to the Datacbase");
  })
  .catch((err) => {
    console.log("DB Connection Failed", err);
  });
