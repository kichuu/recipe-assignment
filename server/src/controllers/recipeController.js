import axios from "axios";
import Recipe from "../models/Recipe.js";
import User from "../models/User.js";

/**
 * Search for recipes using Spoonacular API.
 */
export const searchRecipes = async (req, res) => {
  try {
    console.log("Search Query:", req.query);
    const { query } = req.query;

    const response = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch`,
      {
        params: { query, apiKey: process.env.SPOONACULAR_API_KEY },
      }
    );

    // Format the response to return only necessary fields
    const formattedRecipes = response.data.results.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
    }));

    res.json(formattedRecipes);
  } catch (error) {
    console.error("Error searching recipes:", error);
    res.status(500).json({ error: "Failed to search recipes" });
  }
};

/**
 * Get detailed information about a recipe.
 */
export const getRecipeDetails = async (req, res) => {
  try {
    console.log("Recipe ID:", req.params);
    const { id } = req.params;

    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/information`,
      {
        params: { apiKey: process.env.SPOONACULAR_API_KEY },
      }
    );

    const recipeData = response.data;

    // Format the response to match frontend expectations
    const formattedRecipe = {
      id: recipeData.id,
      title: recipeData.title,
      image: recipeData.image,
      ingredients:
        recipeData.extendedIngredients?.map((ing) => ({
          name: ing.name,
          image: `https://spoonacular.com/cdn/ingredients_100x100/${ing.image}`,
        })) || [],
      instructions:
        recipeData.analyzedInstructions[0]?.steps.map((step) => step.step) ||
        [],
    };

    res.json(formattedRecipe);
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    res.status(500).json({ error: "Failed to fetch recipe details" });
  }
};

/**
 * Save a recipe to the user's collection.
 */
export const saveRecipe = async (req, res) => {
  try {
    console.log("Saving Recipe:", req.body);
    const { title, imageUrl, ingredients, instructions } = req.body;

    if (!title || !imageUrl || !ingredients.length || !instructions.length) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const recipe = new Recipe({
      title,
      imageUrl,
      ingredients,
      instructions,
      createdBy: req.user.userId,
    });

    await recipe.save();

    // Update user's saved recipes
    const user = await User.findById(req.user.userId);
    user.savedRecipes.push(recipe._id);
    await user.save();

    res.status(201).json(recipe);
  } catch (error) {
    console.error("Error saving recipe:", error);
    res.status(500).json({ error: "Failed to save recipe" });
  }
};

/**
 * Retrieve all recipes saved by the authenticated user.
 */
export const getUserRecipes = async (req, res) => {
  try {
    console.log("Fetching User Recipes for:", req.user.userId);

    const user = await User.findById(req.user.userId).populate("savedRecipes");

    res.json(user.savedRecipes);
  } catch (error) {
    console.error("Error fetching user recipes:", error);
    res.status(500).json({ error: "Failed to fetch user recipes" });
  }
};
