"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useAlert } from "@/lib/alert-context";

interface Ingredient {
  name: string;
  image: string;
}

interface RecipeDetails {
  _id: string;
  id: string;
  title: string;
  image: string;
  ingredients: Ingredient[];
  instructions: string[];
}

export default function RecipePage() {
  const { id } = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<RecipeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const { showAlert } = useAlert();
  const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await axios.get(
          `${NEXT_PUBLIC_API_BASE_URL}/recipes/rec/${id}`
        );
        setRecipe(response.data);

        // Ensure `_id` consistency
        const savedRecipes = JSON.parse(
          localStorage.getItem("savedRecipes") || "[]"
        );
        setSaved(savedRecipes.some((r: RecipeDetails) => r._id === id));
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRecipeDetails();
  }, [id]);

  const saveRecipe = async () => {
    if (!recipe) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        showAlert(
          "Authentication required",
          "Please log in to save recipes",
          "info"
        );
        router.push("/login");
        return;
      }

      // Prevent duplicate save
      if (saved) {
        showAlert("Info", "You have already saved this recipe.", "info");
        return;
      }

      await axios.post(
        `${NEXT_PUBLIC_API_BASE_URL}/recipes/save`,
        {
          id: recipe.id,
          title: recipe.title,
          imageUrl: recipe.image,
          ingredients: recipe.ingredients.map((ing) => ing.name),
          instructions: recipe.instructions.join(" "),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Save locally to prevent duplicate saves
      const savedRecipes = JSON.parse(
        localStorage.getItem("savedRecipes") || "[]"
      );
      localStorage.setItem(
        "savedRecipes",
        JSON.stringify([...savedRecipes, recipe])
      );

      setSaved(true);
      showAlert("Success", "Recipe saved successfully!", "success");
    } catch (error) {
      console.error("Save Recipe Error:", error);
      showAlert("Error", "Failed to save recipe. Please try again.", "error");
    }
  };

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

      <div className="flex gap-4 mt-6">
        <Button onClick={() => router.back()}>Go Back</Button>
        <Button
          onClick={saveRecipe}
          variant={saved ? "outline" : "default"}
          disabled={saved}
        >
          {saved ? "Saved" : "Save Recipe"}
        </Button>
      </div>
    </div>
  );
}
