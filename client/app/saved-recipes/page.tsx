"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import RecipeCard from "@/components/recipe-card";
import { useAlert } from "@/lib/alert-context";

interface Recipe {
  _id: string;
  title: string;
  imageUrl: string;
  ingredients: string[];
  instructions: string;
}

export default function SavedRecipes() {
  const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        showAlert(
          "Authentication required",
          "Please login to view saved recipes",
          "info"
        );
        router.push("/login");
        return;
      }

      try {
        const response = await axios.get(
          `${NEXT_PUBLIC_API_BASE_URL}/recipes/user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRecipes(response.data);
      } catch (error) {
        showAlert("Error", "Failed to fetch saved recipes", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedRecipes();
  }, [router, showAlert]);

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
                <RecipeCard key={recipe._id} recipe={recipe} saved />
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
