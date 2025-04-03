"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";

interface Ingredient {
  name: string;
  image: string;
}

interface RecipeDetails {
  id: string;
  title: string;
  image: string;
  ingredients: Ingredient[];
  instructions: string[];
}

export default function RecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<RecipeDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/recipes/${id}`
        );
        setRecipe(response.data);
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRecipeDetails();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-10">Loading recipe details...</p>;
  }

  if (!recipe) {
    return <p className="text-center mt-10">Recipe not found.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">{recipe.title}</h1>
      <img
        src={recipe.image}
        alt={recipe.title}
        className="w-full max-w-2xl mx-auto my-6 rounded-lg shadow-md"
      />

      <h2 className="text-xl font-semibold mt-6">Ingredients</h2>
      <ul className="list-disc ml-6 mt-2">
        {recipe.ingredients.map((ing, index) => (
          <li key={index} className="flex items-center gap-2">
            <img
              src={ing.image}
              alt={ing.name}
              className="w-10 h-10 rounded-full"
            />
            {ing.name}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mt-6">Instructions</h2>
      <ol className="list-decimal ml-6 mt-2">
        {recipe.instructions.map((step, index) => (
          <li key={index} className="mt-2">
            {step}
          </li>
        ))}
      </ol>

      <Button onClick={() => history.back()} className="mt-6">
        Go Back
      </Button>
    </div>
  );
}
