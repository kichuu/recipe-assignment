import express from "express";
import {
  searchRecipes,
  saveRecipe,
  getUserRecipes,
  getRecipeDetails,
  getRandomRecipes,
  deleteSavedRecipes,
} from "../controllers/recipeController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/random", getRandomRecipes);

router.get("/search", searchRecipes);
router.get("/user", authenticate, getUserRecipes);

router.get("/rec/:id", getRecipeDetails); // New route for detailed recipe info
router.delete("/:id", authenticate, deleteSavedRecipes);
router.post("/save", authenticate, saveRecipe);

export default router;
