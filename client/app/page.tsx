"use client";

import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import RecipeCard from "@/components/recipe-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAlert } from "@/lib/alert-context";

interface Recipe {
  id: string;
  title: string;
  image: string;
}

export default function Home() {
  const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showAlert } = useAlert();

  // Fetch random recipes on mount
  useEffect(() => {
    fetchRandomRecipes();
  }, []);

  const fetchRandomRecipes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${NEXT_PUBLIC_API_BASE_URL}/recipes/random?number=6`
      );
      console.log(response.data);

      setRecipes(response.data || []);
    } catch (error) {
      showAlert("Error", "Failed to fetch random recipes.", "error");
    } finally {
      setLoading(false);
    }
  };

  const searchRecipes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `${NEXT_PUBLIC_API_BASE_URL}/recipes/search?query=${searchTerm}`
      );
      setRecipes(response.data || []);
    } catch (error) {
      showAlert(
        "Error",
        "Failed to search recipes. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchRecipes(e);
    }
  };

  const saveRecipe = async (recipe: Recipe) => {
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

      const savedRecipes = JSON.parse(
        localStorage.getItem("savedRecipes") || "[]"
      );
      const isAlreadySaved = savedRecipes.some(
        (r: Recipe) => r.id === recipe.id
      );

      if (isAlreadySaved) {
        showAlert("Info", "You have already saved this recipe.", "info");
        return;
      }

      await axios.post(
        `${NEXT_PUBLIC_API_BASE_URL}/recipes/save`,
        {
          id: recipe.id,
          title: recipe.title,
          imageUrl: recipe.image,
          ingredients: [],
          instructions: "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem(
        "savedRecipes",
        JSON.stringify([...savedRecipes, recipe])
      );
      showAlert("Success", "Recipe saved successfully!", "success");
    } catch (error) {
      console.error("Save Recipe Error:", error);
      showAlert("Error", "Failed to save recipe. Please try again.", "error");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Recipe Search</h1>

      <form onSubmit={searchRecipes} className="mb-8">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search for recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={{
                _id: recipe.id,
                title: recipe.title,
                imageUrl: recipe.image,
                ingredients: [],
                instructions: [],
              }}
              onSave={() => saveRecipe(recipe)}
            />
          ))}
        </div>
      )}

      {recipes.length === 0 && !loading && (
        <p className="text-center text-gray-500 my-12">
          No recipes found. Try searching for something else!
        </p>
      )}
    </div>
  );
}
