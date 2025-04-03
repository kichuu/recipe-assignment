import express from "express";
import {
  searchRecipes,
  saveRecipe,
  getUserRecipes,
} from "../controllers/recipeController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/search", searchRecipes);
router.post("/save", authenticate, saveRecipe);
router.get("/user", authenticate, getUserRecipes);

export default router;
