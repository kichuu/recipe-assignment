import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
});

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  ingredients: [IngredientSchema], // Ingredients as objects (name + image)
  instructions: { type: [String], required: true }, // Array of instruction steps
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Recipe = mongoose.model("Recipe", RecipeSchema);
export default Recipe;
