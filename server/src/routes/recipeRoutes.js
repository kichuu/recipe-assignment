import express from "express";
import {
  searchRecipes,
  saveRecipe,
  getUserRecipes,
  getRecipeDetails,
} from "../controllers/recipeController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/search", searchRecipes);
router.get("/:id", getRecipeDetails); // New route for detailed recipe info

router.post("/save", authenticate, saveRecipe);
router.get("/user", authenticate, getUserRecipes);

export default router;
