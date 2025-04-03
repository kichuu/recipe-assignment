import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
});

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  spoonId: { type: String, required: false },
  ingredients: [{ type: String, required: true }], // Change to array of strings
  instructions: { type: [String], required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Recipe = mongoose.model("Recipe", RecipeSchema);
export default Recipe;
