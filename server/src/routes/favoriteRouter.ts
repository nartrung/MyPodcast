import { toggleFavorite, getAllFavorites, isFavorive } from "#/controllers/favorite.controller";
import { verifyAuth } from "#/middlewares/verify-auth";
import { Router } from "express";

const favoriteRouter = Router();

favoriteRouter.post("/", verifyAuth, toggleFavorite);
favoriteRouter.get("/:audioId", verifyAuth, isFavorive);
favoriteRouter.get("/", verifyAuth, getAllFavorites);

export default favoriteRouter;
