"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import RecipeCard from "@/components/recipe-card";
import { useAlert } from "@/lib/alert-context";
import SavedRecipeCard from "@/components/savedrecipe-card";

interface Recipe {
  _id: string;
  title: string;
  imageUrl: string;
  spoonId: number;
  ingredients: string[];
  instructions: string[]; // Changed from string to string[]
}

export default function SavedRecipes() {
  const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { showAlert } = useAlert();
  const token = localStorage.getItem("token");
  if (!token) {
    showAlert(
      "Authentication required",
      "Please login to view saved recipes",
      "info"
    );

    // Delay redirection slightly to let alert show
    setTimeout(() => {
      router.push("/login");
    }, 500);

    return;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Saved Recipes</h1>

      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <div
                  key={recipe.spoonId}
                  className="cursor-pointer"
                  onClick={() => router.push(`/search/${recipe.spoonId}`)}
                >
                  <SavedRecipeCard
                    recipe={recipe}
                    onUnsave={async () => {
                      try {
                        const token = localStorage.getItem("token");
                        await axios.delete(
                          `${NEXT_PUBLIC_API_BASE_URL}/recipes/${recipe._id}`,
                          {
                            headers: { Authorization: `Bearer ${token}` },
                          }
                        );
                        setRecipes((prev) =>
                          prev.filter((r) => r._id !== recipe._id)
                        );
                        showAlert("Success", "Recipe unsaved", "success");
                      } catch (error) {
                        showAlert("Error", "Failed to unsave recipe", "error");
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 my-12">
              <p>You haven't saved any recipes yet.</p>
              <p className="mt-2">
                <a href="/" className="text-primary hover:underline">
                  Search for recipes to save
                </a>
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
