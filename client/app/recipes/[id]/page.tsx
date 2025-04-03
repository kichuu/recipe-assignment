"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

interface Ingredient {
  name: string;
  image: string;
}

interface Recipe {
  id: string;
  title: string;
  image: string;
  ingredients: Ingredient[];
  instructions: string[];
}

export default function RecipeDetails() {
  const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const params = useParams();
  const recipeId = params?.id as string;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!recipeId) return;

    const fetchRecipe = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${NEXT_PUBLIC_API_BASE_URL}/recipes/${recipeId}`
        );
        setRecipe(response.data);
      } catch (err) {
        console.error("Error fetching recipe:", err);
        setError("Failed to fetch recipe. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!recipe)
    return <p className="text-center text-gray-500">Recipe not found.</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">{recipe.title}</h1>
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full max-w-md my-4 rounded-lg"
        />
      )}

      {/* Ingredients List */}
      <h2 className="text-2xl font-semibold mt-4">Ingredients</h2>
      {recipe.ingredients?.length > 0 ? (
        <ul className="list-disc pl-6">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="flex items-center gap-2">
              {ingredient.image && (
                <img
                  src={ingredient.image}
                  alt={ingredient.name}
                  className="w-10 h-10 rounded-full"
                />
              )}
              {ingredient.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No ingredients listed.</p>
      )}

      {/* Instructions List */}
      <h2 className="text-2xl font-semibold mt-4">Instructions</h2>
      {recipe.instructions?.length > 0 ? (
        <ol className="list-decimal pl-6">
          {recipe.instructions.map((step, index) => (
            <li key={index} className="mt-2">
              {step}
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-gray-500">No instructions available.</p>
      )}
    </div>
  );
}
