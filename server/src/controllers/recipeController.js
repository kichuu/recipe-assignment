import axios from "axios";
import Recipe from "../models/Recipe.js";

export const searchRecipes = async (req, res) => {
  try {
    const { query } = req.query;
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch`,
      {
        params: { query, apiKey: process.env.SPOONACULAR_API_KEY },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const saveRecipe = async (req, res) => {
  try {
    const { title, imageUrl, ingredients, instructions } = req.body;
    const recipe = new Recipe({
      title,
      imageUrl,
      ingredients,
      instructions,
      createdBy: req.user.userId,
    });
    await recipe.save();

    const user = await User.findById(req.user.userId);
    user.savedRecipes.push(recipe._id);
    await user.save();

    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("savedRecipes");
    res.json(user.savedRecipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
